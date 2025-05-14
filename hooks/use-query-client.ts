import { useQueryClient } from "@tanstack/react-query"

export function useAppQueryClient() {
  const queryClient = useQueryClient()

  // Helper function to invalidate profile queries
  const invalidateProfile = (username?: string) => {
    if (username) {
      queryClient.invalidateQueries({ queryKey: ["profile", username] })
    } else {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    }
  }

  // Helper function to invalidate all user data
  const invalidateUserData = () => {
    queryClient.invalidateQueries({ queryKey: ["profile"] })
    queryClient.invalidateQueries({ queryKey: ["links"] })
    queryClient.invalidateQueries({ queryKey: ["projects"] })
    queryClient.invalidateQueries({ queryKey: ["skills"] })
    queryClient.invalidateQueries({ queryKey: ["education"] })
    queryClient.invalidateQueries({ queryKey: ["experience"] })
  }

  return {
    queryClient,
    invalidateProfile,
    invalidateUserData,
  }
}
