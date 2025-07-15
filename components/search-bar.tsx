"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [priceRange, setPriceRange] = useState("")

  const handleSearch = () => {
    // Implement search functionality
    console.log("Searching for:", { searchQuery, location, priceRange })
  }

  return (
    <div className="bg-card p-4 rounded-lg border">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="suva">Suva</SelectItem>
            <SelectItem value="nadi">Nadi</SelectItem>
            <SelectItem value="lautoka">Lautoka</SelectItem>
            <SelectItem value="labasa">Labasa</SelectItem>
            <SelectItem value="ba">Ba</SelectItem>
            <SelectItem value="sigatoka">Sigatoka</SelectItem>
          </SelectContent>
        </Select>

        <Select value={priceRange} onValueChange={setPriceRange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Price Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Prices</SelectItem>
            <SelectItem value="0-100">$0 - $100</SelectItem>
            <SelectItem value="100-500">$100 - $500</SelectItem>
            <SelectItem value="500-1000">$500 - $1,000</SelectItem>
            <SelectItem value="1000-5000">$1,000 - $5,000</SelectItem>
            <SelectItem value="5000+">$5,000+</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleSearch} className="w-full md:w-auto">
          <Filter className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  )
}
