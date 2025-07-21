"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/lib/supabaseClient";
import { Plus, Edit, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function MyListingsPage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching listings:", error);
        } else {
          setListings(data);
        }
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Please sign in to view your listings</h1>
        <Button asChild>
          <Link href="/auth/signin">Sign In</Link>
        </Button>
      </div>
    );
  }

  const activeListings = listings.filter((l) => l.status === "active");
  const soldListings = listings.filter((l) => l.status === "sold");
  const inactiveListings = listings.filter((l) => l.status === "inactive");

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
          />
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
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
            <p className="text-muted-foreground text-sm mb-2 line-clamp-2">{listing.description}</p>
            <div className="flex items-center justify-between">
              <span className="font-bold text-lg">${listing.price?.toLocaleString()}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link href={`/products/${listing.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Listings</h1>
        <Button asChild>
          <Link href="/listings/new">
            <Plus className="h-4 w-4 mr-2" />
            Create New Listing
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList>
          <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
          <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inactive ({inactiveListings.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeListings.length > 0 ? (
            activeListings.map((l) => <ListingCard key={l.id} listing={l} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No active listings</h3>
                <p className="text-muted-foreground mb-4">
                  Create your first listing to start selling
                </p>
                <Button asChild>
                  <Link href="/listings/new">Create Listing</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sold" className="space-y-4">
          {soldListings.length > 0 ? (
            soldListings.map((l) => <ListingCard key={l.id} listing={l} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No sold items</h3>
                <p className="text-muted-foreground">
                  Items you've successfully sold will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          {inactiveListings.length > 0 ? (
            inactiveListings.map((l) => <ListingCard key={l.id} listing={l} />)
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No inactive listings</h3>
                <p className="text-muted-foreground">
                  Paused or expired listings will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}