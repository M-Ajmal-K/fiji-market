"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth-provider";  // ← useAuth from your AuthProvider
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const categories = [
  { id: "electronics", name: "Electronics" },
  { id: "vehicles", name: "Vehicles" },
  { id: "real-estate", name: "Real Estate" },
  { id: "furniture", name: "Furniture" },
  { id: "sports", name: "Sports & Outdoors" },
  { id: "baby-kids", name: "Baby & Kids" },
  { id: "fashion", name: "Fashion" },
  { id: "books", name: "Books & Media" },
  { id: "business", name: "Business & Industrial" },
  { id: "music", name: "Music & Instruments" },
];

const locations = [
  "Suva",
  "Nadi",
  "Lautoka",
  "Labasa",
  "Ba",
  "Sigatoka",
  "Nausori",
  "Tavua",
  "Korovou",
  "Levuka",
];

export default function EditListingPage() {
  // 1) Always call hooks in the same order
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    if (!id || !user) return;

    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error(error);
          router.push("/my-listings");
        } else if (data.user_id !== user.id) {
          // prevent unauthorized edits
          router.push("/my-listings");
        } else {
          setTitle(data.title);
          setDescription(data.description || "");
          setCategory(data.category);
          setLocation(data.location);
          setPrice(data.price.toString());
        }
        setLoading(false);
      });
  }, [id, user, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from("listings")
      .update({
        title,
        description,
        category,
        location,
        price: parseFloat(price),
      })
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert("Update failed");
      console.error(error);
    } else {
      router.push("/my-listings");
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading…</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Edit Listing</h1>
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Location</Label>
          <Select value={location} onValueChange={setLocation} required>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Price (FJD)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Updating…" : "Update Listing"}
        </Button>
      </form>
    </div>
  );
}
