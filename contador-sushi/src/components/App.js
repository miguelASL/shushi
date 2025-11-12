import React, { useState } from 'react';
import '../styles/App.css';

// Componente Sparkles simplificado
const Sparkles = ({ className, size = 24 }) => (
    <svg 
        className={className}
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
    >
        <path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" />
    </svg>
);

function App() {
    const [count, setCount] = useState(0);
    const [isHappy, setIsHappy] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [showSparkle, setShowSparkle] = useState(false);

    const handleCount = () => {
        setCount(count + 1);
        setIsHappy(true);
        setShowSparkle(true);
        
        setTimeout(() => {
            setIsHappy(false);
        }, 500);
        
        setTimeout(() => {
            setShowSparkle(false);
        }, 800);
    };

    const handleFinish = () => {
        setIsFinished(true);
    };

    const handleReset = () => {
        setCount(0);
        setIsFinished(false);
        setIsHappy(false);
    };

    if (isFinished) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
                <div className="text-center">
                    <div className="text-8xl mb-6 animate-bounce">🍣</div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        ¡Qué rico!
                    </h1>
                    <p className="text-6xl font-bold text-red-500 mb-4">{count}</p>
                    <p className="text-2xl text-gray-600 mb-8">
                        {count === 1 ? 'pieza de sushi' : 'piezas de sushi'} comidas
                    </p>
                    <button
                        onClick={handleReset}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105"
                    >
                        Comer más sushi 🍱
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Partículas decorativas */}
            <div className="absolute top-10 left-10 text-4xl animate-pulse">🍱</div>
            <div className="absolute top-20 right-20 text-3xl animate-pulse delay-100">🥢</div>
            <div className="absolute bottom-20 left-20 text-3xl animate-pulse delay-200">🍶</div>
            <div className="absolute bottom-10 right-10 text-4xl animate-pulse delay-300">🍣</div>

            {/* Contador */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Sushi comidos</h2>
                <div className="text-7xl font-bold text-red-500">{count}</div>
            </div>

            {/* Sushi animado */}
            <div className="relative mb-12">
                {/* Sparkles cuando come */}
                {showSparkle && (
                    <>
                        <Sparkles className="absolute -top-4 -left-4 text-yellow-400 animate-ping" size={32} />
                        <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-ping" size={32} />
                        <Sparkles className="absolute -bottom-4 -left-4 text-yellow-400 animate-ping" size={32} />
                        <Sparkles className="absolute -bottom-4 -right-4 text-yellow-400 animate-ping" size={32} />
                    </>
                )}
                
                {/* Sushi cartoon */}
                <div 
                    className={`relative transition-all duration-300 ${
                        isHappy ? 'scale-125 rotate-12' : 'scale-100'
                    }`}
                >
                    {/* Cuerpo del sushi */}
                    <div className="w-48 h-32 bg-gradient-to-r from-orange-400 to-red-400 rounded-full relative shadow-2xl">
                        {/* Arroz */}
                        <div className="absolute bottom-0 w-full h-16 bg-white rounded-b-full"></div>
                        
                        {/* Ojos */}
                        <div className="absolute top-8 left-12 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <div className={`w-5 h-5 bg-black rounded-full transition-all ${
                                isHappy ? 'scale-150' : ''
                            }`}></div>
                        </div>
                        <div className="absolute top-8 right-12 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <div className={`w-5 h-5 bg-black rounded-full transition-all ${
                                isHappy ? 'scale-150' : ''
                            }`}></div>
                        </div>
                        
                        {/* Boca */}
                        <div className={`absolute bottom-6 left-1/2 transform -translate-x-1/2 transition-all ${
                            isHappy 
                                ? 'w-16 h-8 border-4 border-black rounded-t-full border-b-0' 
                                : 'w-12 h-1 bg-black rounded-full'
                        }`}></div>
                        
                        {/* Mejillas */}
                        {isHappy && (
                            <>
                                <div className="absolute top-14 left-6 w-6 h-6 bg-pink-300 rounded-full opacity-60"></div>
                                <div className="absolute top-14 right-6 w-6 h-6 bg-pink-300 rounded-full opacity-60"></div>
                            </>
                        )}
                        
                        {/* Alga nori */}
                        <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-8 bg-gray-800 opacity-80"></div>
                    </div>
                </div>
            </div>

            {/* Botones */}
            <div className="flex flex-col gap-4">
                <button
                    onClick={handleCount}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-6 px-12 rounded-full text-2xl transition-all transform hover:scale-110 active:scale-95 shadow-xl"
                >
                    ¡Comer Sushi! 🍣
                </button>
                
                {count > 0 && (
                    <button
                        onClick={handleFinish}
                        className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg"
                    >
                        Ya estoy lleno
                    </button>
                )}
            </div>

            {/* Mensaje motivador */}
            {count > 0 && (
                <div className="mt-8 text-center animate-fade-in">
                    <p className="text-xl text-gray-700 font-medium">
                        {count < 5 && "¡Sigue comiendo! 😋"}
                        {count >= 5 && count < 10 && "¡Qué apetito! 🤤"}
                        {count >= 10 && count < 20 && "¡Eres todo un experto! 🥢"}
                        {count >= 20 && "¡NIVEL MAESTRO SUSHI! 🏆"}
                    </p>
                </div>
            )}
        </div>
    );
}

export default App;
