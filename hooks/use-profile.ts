import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getProfileByUserId, getProfileByUsername, updateProfile } from "@/lib/supabase"
import type { Profile } from "@/types"

// Hook untuk mendapatkan profil berdasarkan user ID
export function useProfileByUserId(userId: string) {
  return useQuery({
    queryKey: ["profile", "userId", userId],
    queryFn: () => getProfileByUserId(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook untuk mendapatkan profil berdasarkan username
export function useProfileByUsername(username: string) {
  return useQuery({
    queryKey: ["profile", "username", username],
    queryFn: () => getProfileByUsername(username),
    enabled: !!username,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

// Hook untuk memperbarui profil
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (profile: Profile) => updateProfile(profile),
    onSuccess: (data) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["profile", "userId", data.user_id] })
      queryClient.invalidateQueries({ queryKey: ["profile", "username", data.username] })
    },
  })
}
