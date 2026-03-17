import React, { useState, useEffect } from 'react';
import { Mail, Lock, LogOut, Search, ChevronLeft, ChevronRight, Clock, Flame, ChefHat, Home, Book, Heart, User, Menu, SlidersHorizontal, Camera, Lightbulb, Activity } from 'lucide-react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Toaster, toast } from 'react-hot-toast';
import { categories, recipes, Recipe, Category } from './data/recipes';
import { motion, AnimatePresence } from 'motion/react';
import { useSwipeable } from 'react-swipeable';
import { playTapSound, playSwipeSound, playSuccessSound, playErrorSound } from './utils/sounds';
import Onboarding from './components/Onboarding';

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Navigation state
  const [currentTab, setCurrentTab] = useState<'home' | 'recipes' | 'favorites' | 'profile'>('home');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [lastViewedRecipeId, setLastViewedRecipeId] = useState<string | null>(() => {
    const saved = localStorage.getItem('lastViewedRecipeId');
    return saved || null;
  });
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [language, setLanguage] = useState('Español');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const tabs = ['home', 'recipes', 'favorites', 'profile'] as const;
  type Tab = typeof tabs[number];

  useEffect(() => {
    if (selectedRecipe) {
      setLastViewedRecipeId(String(selectedRecipe.id));
      localStorage.setItem('lastViewedRecipeId', String(selectedRecipe.id));
    }
  }, [selectedRecipe]);

  const handleTabChange = (tab: Tab) => {
    if (tab !== currentTab) {
      playTapSound();
      setCurrentTab(tab);
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedRecipe) return;
      const currentIndex = tabs.indexOf(currentTab);
      if (currentIndex < tabs.length - 1) {
        playSwipeSound();
        setCurrentTab(tabs[currentIndex + 1]);
      }
    },
    onSwipedRight: () => {
      if (selectedRecipe) {
        playSwipeSound();
        setSelectedRecipe(null);
        return;
      }
      const currentIndex = tabs.indexOf(currentTab);
      if (currentIndex > 0) {
        playSwipeSound();
        setCurrentTab(tabs[currentIndex - 1]);
      }
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        toast.success('Foto de perfil actualizada');
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleFavorite = (recipeId: string | number) => {
    playTapSound();
    const idStr = String(recipeId);
    setFavorites(prev => 
      prev.includes(idStr) 
        ? prev.filter(id => id !== idStr)
        : [...prev, idStr]
    );
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            if (!userDoc.data().hasSeenOnboarding) {
              setShowOnboarding(true);
            }
          } else {
            setShowOnboarding(true);
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
        }
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const completeOnboarding = async () => {
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          hasSeenOnboarding: true
        });
      } catch (error) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            hasSeenOnboarding: true,
            createdAt: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.error("Error saving onboarding state:", e);
        }
      }
    }
    setShowOnboarding(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    playTapSound();
    
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        playSuccessSound();
        toast.success('¡Bienvenido de nuevo!');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          createdAt: serverTimestamp(),
          hasSeenOnboarding: false
        });
        playSuccessSound();
        toast.success('¡Registro exitoso!');
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      playErrorSound();
      toast.error('Ocurrió un error en la autenticación.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    playTapSound();
    try {
      await signOut(auth);
      setCurrentTab('home');
      setSelectedRecipe(null);
      toast.success('Sesión cerrada');
    } catch (error) {
      toast.error('Error al cerrar sesión');
    }
  };

  const filteredRecipes = recipes.filter(r => 
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.ingredients.some(i => i.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper to get a placeholder image based on recipe id
  const getRecipeImage = (recipe: Recipe) => {
    // Keep custom uploaded images
    if (recipe.image && (recipe.image.startsWith('data:') || recipe.image.startsWith('blob:') || recipe.image.includes('firebasestorage'))) {
      return recipe.image;
    }
    
    // Find the category image to use as the representative image for all recipes in this category
    const category = categories.find(c => c.name === recipe.category);
    if (category) {
      return category.image;
    }
    
    // Fallback if category not found
    return "https://images.unsplash.com/photo-1493770348161-369560ae357d?w=800&q=80";
  };

  const lastViewedRecipe = lastViewedRecipeId ? recipes.find(r => String(r.id) === lastViewedRecipeId) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen flex items-center justify-center relative bg-stone-900"
      >
        <Toaster position="top-center" />
        <div
          className="absolute inset-0 z-0 opacity-40 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=2072&auto=format&fit=crop")' }}
        />
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
          className="z-10 w-full max-w-md p-6"
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/20 text-orange-400 mb-4"
              >
                <ChefHat size={32} />
              </motion.div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Chef Guadalupe Moran</h1>
              <p className="text-orange-300 font-medium tracking-wide uppercase text-sm">200 Recetas Sin Gluten</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Correo electrónico"
                  required
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-white/50" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-white/10 rounded-xl bg-black/20 text-white placeholder-white/50 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Contraseña"
                  required
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 mt-6 disabled:opacity-50"
              >
                {authLoading ? 'Cargando...' : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
              </motion.button>
            </form>
            <div className="mt-6 text-center">
              <button 
                onClick={() => {
                  playTapSound();
                  setIsLogin(!isLogin);
                }} 
                className="text-sm text-white/70 hover:text-white"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // RECIPE DETAIL VIEW
  if (selectedRecipe) {
    return (
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="min-h-screen bg-white pb-20 md:pb-0 fixed inset-0 md:left-24 lg:left-64 z-50 overflow-y-auto"
        {...swipeHandlers}
      >
        <div className="max-w-4xl mx-auto">
          <div className="relative h-72 md:h-96">
            <img 
              src={getRecipeImage(selectedRecipe)} 
              alt={selectedRecipe.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                playTapSound();
                setSelectedRecipe(null);
              }}
              className="absolute top-4 left-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
            
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => toggleFavorite(selectedRecipe.id)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/20 backdrop-blur-md text-white"
            >
              <Heart className={`h-6 w-6 ${favorites.includes(String(selectedRecipe.id)) ? 'fill-red-500 text-red-500' : ''}`} />
            </motion.button>

            <div className="absolute bottom-4 left-4 right-4 text-white">
              <span className="px-2 py-1 bg-orange-500 text-xs font-bold rounded-md uppercase tracking-wider mb-2 inline-block">
                {selectedRecipe.category}
              </span>
              <h1 className="text-2xl md:text-4xl font-bold leading-tight">{selectedRecipe.title}</h1>
            </div>
          </div>

          <div className="p-5 md:p-8">
            <div className="flex justify-around py-4 border-b border-stone-100 mb-6 md:mb-10">
            {selectedRecipe.time && (
              <div className="flex flex-col items-center text-stone-600">
                <Clock className="h-5 w-5 mb-1 text-orange-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Tiempo</span>
                <span className="text-sm font-semibold">{selectedRecipe.time}</span>
              </div>
            )}
            {selectedRecipe.difficulty && (
              <div className="flex flex-col items-center text-stone-600">
                <ChefHat className="h-5 w-5 mb-1 text-orange-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Dificultad</span>
                <span className="text-sm font-semibold capitalize">{selectedRecipe.difficulty}</span>
              </div>
            )}
            {selectedRecipe.calories && (
              <div className="flex flex-col items-center text-stone-600">
                <Flame className="h-5 w-5 mb-1 text-orange-500" />
                <span className="text-xs font-medium uppercase tracking-wider text-stone-400">Calorías</span>
                <span className="text-sm font-semibold">{selectedRecipe.calories}</span>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-stone-900 mb-4 font-serif italic">Ingredientes</h3>
            <ul className="space-y-3">
              {selectedRecipe.ingredients.map((ingredient, idx) => (
                <li key={idx} className="flex items-start text-stone-700 text-sm">
                  <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-orange-400 mr-3 flex-shrink-0"></div>
                  <span>{ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold text-stone-900 mb-4 font-serif italic">Preparación</h3>
            <div className="space-y-5">
              {selectedRecipe.instructions.map((step, idx) => (
                <div key={idx} className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </div>
                  </div>
                  <p className="text-stone-700 text-sm leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedRecipe.nutrition && (
            <div className="mt-8 bg-stone-50 rounded-2xl p-5 border border-stone-100">
              <div className="flex items-center mb-4">
                <Activity className="h-5 w-5 text-orange-500 mr-2" />
                <h3 className="text-lg font-bold text-stone-900 font-serif italic">Información Nutricional</h3>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
                  <span className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Calorías</span>
                  <span className="block text-sm font-bold text-stone-800">{selectedRecipe.nutrition.calories}</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
                  <span className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Proteína</span>
                  <span className="block text-sm font-bold text-stone-800">{selectedRecipe.nutrition.protein}</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
                  <span className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Carbos</span>
                  <span className="block text-sm font-bold text-stone-800">{selectedRecipe.nutrition.carbs}</span>
                </div>
                <div className="bg-white p-2 rounded-xl shadow-sm border border-stone-100">
                  <span className="block text-xs font-medium text-stone-400 uppercase tracking-wider mb-1">Grasas</span>
                  <span className="block text-sm font-bold text-stone-800">{selectedRecipe.nutrition.fat}</span>
                </div>
              </div>
            </div>
          )}

          {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
            <div className="mt-8 mb-4">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-5 w-5 text-amber-500 mr-2" />
                <h3 className="text-lg font-bold text-stone-900 font-serif italic">Consejos del Chef</h3>
              </div>
              <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100">
                <ul className="space-y-3">
                  {selectedRecipe.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start text-amber-900 text-sm">
                      <div className="h-1.5 w-1.5 mt-1.5 rounded-full bg-amber-400 mr-3 flex-shrink-0"></div>
                      <span className="leading-relaxed">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
        </div>
      </motion.div>
    );
  }

  // MAIN APP VIEW (Mobile First)
  return (
    <div 
      className="min-h-screen bg-stone-50 pb-20 md:pb-0 md:pl-24 lg:pl-64 w-full relative shadow-2xl overflow-hidden flex flex-col"
      {...swipeHandlers}
    >
      <Toaster position="top-center" />
      {showOnboarding && user && <Onboarding onComplete={completeOnboarding} />}
      
      {/* Header */}
      <header className="bg-white px-4 py-3 md:px-8 md:py-4 sticky top-0 z-40 shadow-sm flex justify-between items-center md:hidden">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <ChefHat className="h-6 w-6 text-amber-800 mr-2" />
            <h1 className="text-xl font-script font-bold text-amber-900">Chef Guadalupe Moran</h1>
          </div>
          <motion.button whileTap={{ scale: 0.9 }} className="p-2 text-amber-900">
            <Menu className="h-5 w-5" />
          </motion.button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto overflow-x-hidden relative max-w-7xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {searchQuery ? (
            // Search Results
            <motion.div 
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4"
            >
              <h2 className="text-lg font-bold text-amber-900 mb-4">Resultados de búsqueda</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filteredRecipes.map(recipe => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={recipe.id}
                    onClick={() => {
                      playTapSound();
                      setSelectedRecipe(recipe);
                    }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-amber-100"
                  >
                    <div className="h-32 relative">
                      <img 
                        src={getRecipeImage(recipe)} 
                        alt={recipe.title} 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                        loading="lazy" 
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="text-sm font-bold text-amber-900 line-clamp-2 leading-tight">{recipe.title}</h3>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {currentTab === 'home' && (
                <>
                  {/* Hero Section */}
                  <div className="relative h-48 md:h-72 lg:h-96 w-full">
                    <img 
                      src="http://eliteproteinkitchen.com/wp-content/uploads/2026/03/ChatGPT-Image-17-mar-2026-12_19_54-p.m.png" 
                      alt="Encabezado" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/10"></div>
                  </div>

                  {/* Search Bar (Moved below hero) */}
                  <div className="px-4 py-4 bg-white shadow-sm relative z-10 -mt-4 rounded-t-3xl">
                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-700/50" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="¿Qué vamos a cocinar hoy?"
                          className="w-full pl-9 pr-4 py-3 bg-amber-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 outline-none text-amber-900 placeholder-amber-700/50"
                        />
                      </div>
                      <motion.button whileTap={{ scale: 0.9 }} className="p-3 bg-amber-50 rounded-2xl text-amber-900 hover:bg-amber-100 transition-colors">
                        <SlidersHorizontal className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Continue Reading Section */}
                  {lastViewedRecipe && !searchQuery && (
                    <div className="px-4 pt-6 bg-stone-50">
                      <h2 className="text-xl font-bold text-amber-900 mb-4">Retoma por donde te quedaste</h2>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          playTapSound();
                          setSelectedRecipe(lastViewedRecipe);
                        }}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 flex items-center cursor-pointer"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 mr-4">
                          <img
                            src={getRecipeImage(lastViewedRecipe)}
                            alt={lastViewedRecipe.title}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="flex-1">
                          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">{lastViewedRecipe.category}</span>
                          <h3 className="text-md font-bold text-stone-800 line-clamp-2 mt-1">{lastViewedRecipe.title}</h3>
                          <div className="flex items-center text-stone-500 text-xs mt-2">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{lastViewedRecipe.time || '30 min'}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-amber-300" />
                      </motion.div>
                    </div>
                  )}

                  {/* Categories Carousels */}
                  <div className="py-6 space-y-8 bg-stone-50">
                    {categories.map((category: Category) => {
                      const categoryRecipes = recipes.filter(r => r.category === category.name);
                      if (categoryRecipes.length === 0) return null;

                      return (
                        <div key={category.name} className="px-4">
                          <h2 className="text-3xl font-script text-amber-900 mb-4 px-2">{category.name}</h2>
                          
                          {/* Horizontal Scroll Container */}
                          <div className="flex overflow-x-auto pb-4 -mx-4 px-4 space-x-4 snap-x snap-mandatory hide-scrollbar">
                            {categoryRecipes.slice(0, 10).map(recipe => (
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                key={recipe.id}
                                onClick={() => {
                                  playTapSound();
                                  setSelectedRecipe(recipe);
                                }}
                                className="relative flex-none w-44 h-44 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden snap-start cursor-pointer shadow-sm"
                              >
                                <img 
                                  src={getRecipeImage(recipe)} 
                                  alt={recipe.title} 
                                  className="absolute inset-0 w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                  <h3 className="text-white text-sm font-medium leading-tight line-clamp-2">
                                    {recipe.title}
                                  </h3>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {currentTab === 'recipes' && (
                <div className="p-4 bg-stone-50 min-h-full">
                  <h2 className="text-3xl font-script text-amber-900 mb-6">Todas las Recetas</h2>
                  <div className="space-y-6">
                    {categories.map((category: Category) => {
                      const categoryRecipes = recipes.filter(r => r.category === category.name);
                      if (categoryRecipes.length === 0) return null;
                      return (
                        <div key={category.name}>
                          <h3 className="text-3xl font-script text-amber-900 mb-4 px-2">{category.name}</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {categoryRecipes.map(recipe => (
                              <motion.div 
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                key={recipe.id}
                                onClick={() => {
                                  playTapSound();
                                  setSelectedRecipe(recipe);
                                }}
                                className="flex items-center bg-white p-3 rounded-2xl shadow-sm border border-amber-100 cursor-pointer hover:shadow-md transition-shadow"
                              >
                                <img 
                                  src={getRecipeImage(recipe)} 
                                  alt={recipe.title} 
                                  className="w-16 h-16 rounded-xl object-cover mr-4" 
                                  referrerPolicy="no-referrer" 
                                  loading="lazy" 
                                />
                                <div className="flex-1">
                                  <h4 className="text-sm font-bold text-amber-900 line-clamp-1">{recipe.title}</h4>
                                  <div className="flex items-center text-xs text-amber-700 mt-1 space-x-3">
                                    <span className="flex items-center"><Clock className="w-3 h-3 mr-1"/> {recipe.time}</span>
                                    <span className="flex items-center"><Flame className="w-3 h-3 mr-1"/> {recipe.calories}</span>
                                  </div>
                                </div>
                                <ChevronLeft className="w-5 h-5 text-amber-300 rotate-180" />
                              </motion.div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {currentTab === 'favorites' && (
                <div className="p-4 bg-stone-50 min-h-full">
                  <h2 className="text-3xl font-script text-amber-900 mb-6">Mis Favoritos</h2>
                  {recipes.filter(r => favorites.includes(String(r.id))).length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                      {recipes.filter(r => favorites.includes(String(r.id))).map(recipe => (
                        <motion.div 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          key={recipe.id}
                          onClick={() => {
                            playTapSound();
                            setSelectedRecipe(recipe);
                          }}
                          className="bg-white rounded-2xl overflow-hidden shadow-sm border border-amber-100 relative cursor-pointer"
                        >
                          <div className="h-32 relative">
                            <img 
                              src={getRecipeImage(recipe)} 
                              alt={recipe.title} 
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer" 
                              loading="lazy" 
                            />
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={(e) => { e.stopPropagation(); toggleFavorite(recipe.id); }}
                              className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full text-red-500"
                            >
                              <Heart className="w-4 h-4 fill-current" />
                            </motion.button>
                          </div>
                          <div className="p-3">
                            <h3 className="text-sm font-bold text-amber-900 line-clamp-2 leading-tight">{recipe.title}</h3>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 px-4">
                      <Heart className="w-12 h-12 text-amber-200 mx-auto mb-4" />
                      <p className="text-amber-800 font-medium">Aún no tienes recetas favoritas.</p>
                      <p className="text-amber-600 text-sm mt-2">Explora y guarda las que más te gusten.</p>
                      <motion.button 
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleTabChange('home')}
                        className="mt-6 px-6 py-2 bg-amber-600 text-white rounded-full text-sm font-medium"
                      >
                        Explorar recetas
                      </motion.button>
                    </div>
                  )}
                </div>
              )}

              {currentTab === 'profile' && (
                <div className="p-4 bg-stone-50 min-h-full">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-script text-amber-900 mb-6">Mi Perfil</h2>
                    
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-amber-100 mb-6 text-center">
                      <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 rounded-full bg-amber-100 border-4 border-white shadow-md overflow-hidden mx-auto flex items-center justify-center">
                          {profilePic ? (
                            <img src={profilePic} alt="Perfil" className="w-full h-full object-cover" referrerPolicy="no-referrer" loading="lazy" />
                          ) : (
                            <User className="w-12 h-12 text-amber-400" />
                          )}
                        </div>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            playTapSound();
                            fileInputRef.current?.click();
                          }}
                          className="absolute bottom-0 right-0 bg-amber-600 text-white p-1.5 rounded-full shadow-sm border-2 border-white hover:bg-amber-700 transition-colors"
                        >
                          <Camera className="w-4 h-4" />
                        </motion.button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          accept="image/*" 
                          className="hidden" 
                        />
                      </div>
                      <h3 className="text-lg font-bold text-amber-900">{user?.email?.split('@')[0] || 'Usuario'}</h3>
                      <p className="text-sm text-amber-600">{user?.email}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 flex items-center justify-between">
                        <div className="flex items-center text-amber-900">
                          <Book className="w-5 h-5 mr-3 text-amber-500" />
                          <span className="font-medium">Idioma</span>
                        </div>
                        <select 
                          value={language}
                          onChange={(e) => {
                            playTapSound();
                            setLanguage(e.target.value);
                          }}
                          className="bg-amber-50 border-none text-sm text-amber-800 rounded-lg focus:ring-0 cursor-pointer outline-none py-1 px-2"
                        >
                          <option value="Español">Español</option>
                          <option value="English">English</option>
                          <option value="Português">Português</option>
                        </select>
                      </div>

                      <motion.div 
                        whileTap={{ scale: 0.98 }}
                        onClick={() => playTapSound()}
                        className="bg-white rounded-2xl p-4 shadow-sm border border-amber-100 flex items-center justify-between cursor-pointer"
                      >
                        <div className="flex items-center text-amber-900">
                          <Lock className="w-5 h-5 mr-3 text-amber-500" />
                          <span className="font-medium">Privacidad y Seguridad</span>
                        </div>
                        <ChevronLeft className="w-5 h-5 text-amber-300 rotate-180" />
                      </motion.div>

                      <motion.button 
                        whileTap={{ scale: 0.98 }}
                        onClick={handleLogout}
                        className="w-full bg-white rounded-2xl p-4 shadow-sm border border-amber-100 flex items-center text-red-600 mt-6"
                      >
                        <LogOut className="w-5 h-5 mr-3" />
                        <span className="font-medium">Cerrar Sesión</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Navigation / Sidebar */}
      <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:w-24 lg:w-64 md:h-screen md:border-r md:border-t-0 md:flex-col md:justify-start md:pt-8 bg-white border-t border-stone-200 px-6 py-3 flex justify-between items-center z-50">
        <div className="hidden md:flex items-center justify-center w-full mb-12 text-amber-800">
          <ChefHat className="h-8 w-8 lg:mr-2" />
          <span className="font-bold text-xl hidden lg:block">Elite Protein</span>
        </div>
        
        <div className="flex md:flex-col justify-between md:justify-start w-full md:space-y-2">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTabChange('home')}
            className={`flex flex-col lg:flex-row items-center lg:px-4 md:py-3 md:rounded-xl space-y-1 lg:space-y-0 lg:space-x-4 ${currentTab === 'home' ? 'text-amber-700 md:bg-amber-50' : 'text-stone-400 md:hover:bg-stone-50'}`}
          >
            <Home className="h-6 w-6" />
            <span className="text-[10px] lg:text-sm font-medium md:mt-1 lg:mt-0">Inicio</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTabChange('recipes')}
            className={`flex flex-col lg:flex-row items-center lg:px-4 md:py-3 md:rounded-xl space-y-1 lg:space-y-0 lg:space-x-4 ${currentTab === 'recipes' ? 'text-amber-700 md:bg-amber-50' : 'text-stone-400 md:hover:bg-stone-50'}`}
          >
            <Book className="h-6 w-6" />
            <span className="text-[10px] lg:text-sm font-medium md:mt-1 lg:mt-0">Recetas</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTabChange('favorites')}
            className={`flex flex-col lg:flex-row items-center lg:px-4 md:py-3 md:rounded-xl space-y-1 lg:space-y-0 lg:space-x-4 ${currentTab === 'favorites' ? 'text-amber-700 md:bg-amber-50' : 'text-stone-400 md:hover:bg-stone-50'}`}
          >
            <Heart className="h-6 w-6" />
            <span className="text-[10px] lg:text-sm font-medium md:mt-1 lg:mt-0">Favoritos</span>
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => handleTabChange('profile')}
            className={`flex flex-col lg:flex-row items-center lg:px-4 md:py-3 md:rounded-xl space-y-1 lg:space-y-0 lg:space-x-4 ${currentTab === 'profile' ? 'text-amber-700 md:bg-amber-50' : 'text-stone-400 md:hover:bg-stone-50'}`}
          >
            <User className="h-6 w-6" />
            <span className="text-[10px] lg:text-sm font-medium md:mt-1 lg:mt-0">Perfil</span>
          </motion.button>
        </div>
      </nav>
    </div>
  );
}
