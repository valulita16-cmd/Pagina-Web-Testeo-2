import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChefHat, Heart, Book, Sparkles } from 'lucide-react';
import { playTapSound, playSuccessSound } from '../utils/sounds';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "¡Bienvenido a Elite Protein Kitchen!",
      description: "Tu compañero ideal para descubrir recetas saludables, deliciosas y llenas de proteína.",
      icon: <ChefHat className="w-20 h-20 text-amber-600 mb-6" />,
      color: "bg-amber-50"
    },
    {
      title: "Explora Cientos de Recetas",
      description: "Navega por nuestras categorías, desde panes y pizzas hasta postres sin culpa.",
      icon: <Book className="w-20 h-20 text-emerald-600 mb-6" />,
      color: "bg-emerald-50"
    },
    {
      title: "Guarda tus Favoritos",
      description: "Toca el corazón en cualquier receta para guardarla y tenerla siempre a mano.",
      icon: <Heart className="w-20 h-20 text-red-500 mb-6" />,
      color: "bg-red-50"
    },
    {
      title: "¡Todo Listo para Cocinar!",
      description: "Sigue los pasos, revisa la información nutricional y disfruta de tus comidas.",
      icon: <Sparkles className="w-20 h-20 text-blue-500 mb-6" />,
      color: "bg-blue-50"
    }
  ];

  const handleNext = () => {
    playTapSound();
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      playSuccessSound();
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] max-h-[600px]">
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center ${steps[currentStep].color}`}
            >
              {steps[currentStep].icon}
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {steps[currentStep].title}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {steps[currentStep].description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'w-8 bg-amber-600' : 'w-2 bg-gray-200'
                }`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-lg transition-colors flex items-center justify-center"
          >
            {currentStep === steps.length - 1 ? (
              '¡Comenzar!'
            ) : (
              <>
                Siguiente
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
