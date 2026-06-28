"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/stores/authstore";
import { apiFetch } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

interface ProfileData {
  id: number;
  name: string;
  email: string;
  bio: string;
  gender: string;
  avatarUrl: string | null;
  phoneNumber: string;
  totalPosts: number;
  createdAt: string;
  profileCompletion: number;
}

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    gender: "",
    phoneNumber: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      const data = await apiFetch(`/query/user/${user?.id}`);
      setProfile(data);
      setFormData({
        name: data.name || "",
        bio: data.bio || "",
        gender: data.gender || "",
        phoneNumber: data.phoneNumber || "",
      }); 
    }
    catch (err) {
      console.error("Failed to fetch profile:", err);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const handleSave = async () => {
    setSaving(true);
    setError("");

    console.log(formData);

    try {
      await apiFetch("/profile", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });
      await new Promise(resolve => setTimeout(resolve, 500));

      await fetchProfile(); 
      setEditOpen(false); 
    } 
    catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
    finally {
      setSaving(false);
    }
  }; 

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setProfile((prev) => {
      if (!prev) return null;
      return { ...prev, avatarUrl: newAvatarUrl };
    });
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-10 w-40" />
        <div className="rounded-lg border bg-white p-6 shadow-sm dark:bg-gray-900">
          <div className="flex items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-gray-500">No profile data found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <ProfileHeader onEdit={() => setEditOpen(true)} />

      <ProfileCard profile={profile} onAvatarUpdate={handleAvatarUpdate} />

      <EditProfileModal
        open={editOpen}
        onOpenChange={setEditOpen}
        formData={formData}
        setFormData={setFormData}
        onSave={handleSave}
        saving={saving}
        error={error}
      />
    </div>
  );
}