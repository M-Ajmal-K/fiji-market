"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MyListingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch current user's listings
  useEffect(() => {
    if (!user) return;
    supabase
      .from("listings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setListings(data || []);
        setLoading(false);
      });
  }, [user]);

  // Delete handler
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const { error } = await supabase
      .from("listings")
      .delete()
      .eq("id", id);

    if (error) {
      alert("Failed to delete.");
      console.error(error);
    } else {
      setListings((prev) => prev.filter((l) => l.id !== id));
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-8">Loading your listings…</div>;
  }

  if (listings.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No listings found</h1>
        <Button asChild>
          <Link href="/sell">
            <Plus className="h-4 w-4 mr-2" />
            Create Listing
          </Link>
        </Button>
      </div>
    );
  }

  // Card component
  const ListingCard = ({ listing }: { listing: any }) => (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Image
            src={listing.image_url || "/placeholder.svg"}
            alt={listing.title}
            width={100}
            height={100}
            className="w-24 h-24 object-cover rounded-lg"
            unoptimized
          />
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold line-clamp-1">{listing.title}</h3>
              <Badge
                variant={
                  listing.status === "active"
                    ? "default"
                    : listing.status === "sold"
                    ? "secondary"
                    : "outline"
                }
              >
                {listing.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {listing.description}
            </p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">
                ${listing.price.toLocaleString()}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  asChild
                >
                  <Link href={`/product/${listing.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => router.push(`/listings/${listing.id}/edit`)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(listing.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Listings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((l) => (
          <ListingCard key={l.id} listing={l} />
        ))}
      </div>
    </div>
  );
}
