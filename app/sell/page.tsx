"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/auth-provider";
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

export default function NewListingPage() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("You must be logged in to create a listing.");
      return;
    }
    setLoading(true);

    // 1️⃣ Image upload timing
    let imageUrl: string | null = null;
    if (file) {
      console.time("upload");
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${crypto.randomUUID()}.${ext}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("listing-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });

      console.timeEnd("upload");
      console.log("Supabase upload response:", { uploadData, uploadError });

      if (uploadError) {
        console.error("Upload error message:", uploadError.message);
        alert(`Failed to upload image: ${uploadError.message}`);
        setLoading(false);
        return;
      }

      console.time("getPublicUrl");
      const { data: urlData } = supabase.storage
        .from("listing-images")
        .getPublicUrl(filePath);
      console.timeEnd("getPublicUrl");

      imageUrl = urlData.publicUrl;
    }

    // 2️⃣ Insert listing timing
    console.time("insertListing");
    const { error: insertError } = await supabase.from("listings").insert([
      {
        user_id: user.id,
        title,
        description,
        category,
        location,
        price: parseFloat(price),
        image_url: imageUrl,
      },
    ]);
    console.timeEnd("insertListing");

    setLoading(false);

    if (insertError) {
      console.error("Error creating listing:", insertError);
      alert("Failed to create listing.");
      return;
    }

    // 3️⃣ Redirect timing
    console.time("redirect");
    router.push("/my-listings");
    console.timeEnd("redirect");
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <Label>Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>

        {/* Category */}
        <div>
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location */}
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

        {/* Price */}
        <div>
          <Label>Price (FJD)</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <Label>Photo</Label>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
              }
            }}
          />
        </div>

        {/* Submit */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Posting..." : "Post Listing"}
        </Button>
      </form>
    </div>
  );
}
