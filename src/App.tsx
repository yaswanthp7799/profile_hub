import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Sun, Moon, Instagram, X } from 'lucide-react'
import { profiles } from './profiles'

// ProfileList Component
const ProfileList = ({ onSelectProfile }: { onSelectProfile: (profile: typeof profiles[0]) => void }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {profiles.map((profile) => (
        <Card key={profile.id} className="cursor-pointer hover:shadow-lg transition-transform duration-300 hover:scale-105" onClick={() => onSelectProfile(profile)}>
          <CardHeader>
            <CardTitle>{profile.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile.photo} alt={`${profile.name}'s avatar`} />
              <AvatarFallback>{profile.name[0]}</AvatarFallback>
            </Avatar>
            <CardDescription>{profile.bio}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// ProfileCard Component
const ProfileCard = ({ profile, onClose }: { profile: typeof profiles[0], onClose: () => void }) => {
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null)
  const [loadingImages, setLoadingImages] = useState(true)

  useEffect(() => {
    const imagePromises = profile.photos.map((photo) => {
      return new Promise((resolve, reject) => {
        const img = new Image()
        img.src = photo
        img.onload = resolve
        img.onerror = reject
      })
    })

    Promise.all(imagePromises).then(() => {
      setLoadingImages(false)
    }).catch((error) => {
      console.error('Failed to load images:', error)
      setLoadingImages(false)
    })
  }, [profile.photos])

  const handleImageClick = (photo: string) => {
    setEnlargedImage(photo)
  }

  const closeEnlargedImage = () => {
    setEnlargedImage(null)
  }

  return (
    <Card className="max-w-3xl mx-auto transition-opacity duration-500 opacity-100">
      <CardHeader>
        <CardTitle>{profile.name}</CardTitle>
        <CardDescription>{profile.bio}</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Avatar className="w-32 h-32">
            <AvatarImage src={profile.photo} alt={`${profile.name}'s avatar`} />
            <AvatarFallback>{profile.name[0]}</AvatarFallback>
          </Avatar>
          {profile.instagram && (
            <div className="mt-2">
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline flex items-center">
                <Instagram className="mr-2 h-4 w-4" /> Instagram
              </a>
            </div>
          )}
        </div>
        <div>
          <p className="text-muted-foreground">{profile.bio}</p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {profile.photos.map((photo, index) => (
              <div key={index} className="mb-2">
                <img
                  src={photo}
                  alt={`${profile.name} photo ${index + 1}`}
                  className={`w-full h-auto rounded-lg cursor-pointer transition-transform duration-300 hover:scale-105 ${loadingImages ? 'opacity-0' : 'opacity-100'}`}
                  onClick={() => handleImageClick(photo)}
                  onLoad={() => setLoadingImages(false)}
                />
                {loadingImages && (
                  <div className="absolute inset-0 bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" onClick={onClose}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Profiles
        </Button>
      </CardFooter>
      {enlargedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <img
              src={enlargedImage}
              alt="Enlarged"
              className="max-w-3xl max-h-3xl rounded-lg transition-transform duration-300"
            />
            <Button
              variant="outline"
              className="absolute top-4 right-4 bg-white dark:bg-gray-900"
              onClick={closeEnlargedImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  )
}

// Main App Component
export default function ProfileExplorer() {
  const [selectedProfile, setSelectedProfile] = useState<typeof profiles[0] | null>(null)
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Check local storage for the theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
    }
  }, [])

  useEffect(() => {
    // Update the body class based on the theme
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleProfileSelect = (profile: typeof profiles[0]) => {
    setSelectedProfile(profile)
  }

  return (
    <div className="min-h-screen h-full flex flex-col bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Profile Hub</h1>
          <Button variant="outline" onClick={toggleTheme}>
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <div className={`transition-opacity duration-500 ${selectedProfile ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <ProfileList onSelectProfile={handleProfileSelect} />
        </div>
        {selectedProfile && (
          <div className="absolute inset-0 transition-opacity duration-500 opacity-100">
            <ProfileCard profile={selectedProfile} onClose={() => setSelectedProfile(null)} />
          </div>
        )}
      </main>

      <footer className="bg-muted mt-8 dark:bg-gray-800">
        <div className="container mx-auto px-4 py-6 text-center">
          <p>&copy; 2025 Profile Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}