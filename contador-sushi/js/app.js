const { useState, useEffect, useRef } = React;

// SISTEMA DE SONIDOS
const SoundSystem = {
    playEat: () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Sonido más animado y festivo con múltiples notas
        [600, 700, 800].forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = i === 0 ? 'sine' : i === 1 ? 'triangle' : 'sine';
            
            const startTime = audioContext.currentTime + (i * 0.05);
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.15);
        });
    },
    
    playWin: () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Melodía de victoria más elaborada
        [523, 659, 784, 1047, 1319, 1568].forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = i < 3 ? 'sine' : 'triangle';
            
            const startTime = audioContext.currentTime + (i * 0.12);
            gainNode.gain.setValueAtTime(0.4, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    },
    
    playTie: () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Sonido de empate más neutral
        [440, 440, 440, 392, 349].forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sine';
            
            const startTime = audioContext.currentTime + (i * 0.2);
            gainNode.gain.setValueAtTime(0.25, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.3);
        });
    },
    
    playTick: () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'square';
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.05);
    },
    
    playTimeUp: () => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        [400, 350, 300].forEach((freq, i) => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = freq;
            oscillator.type = 'sawtooth';
            
            const startTime = audioContext.currentTime + (i * 0.2);
            gainNode.gain.setValueAtTime(0.3, startTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + 0.4);
        });
    }
};

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

// TIPOS DE SUSHI EXPANDIDOS
const SUSHI_TYPES = {
    salmon: {
        name: 'Nigiri Salmón',
        emoji: '🍣',
        fishColor: 'from-orange-400 to-red-400',
        riceColor: 'white',
        description: 'Clásico japonés',
        hasNori: true
    },
    tuna: {
        name: 'Nigiri Atún',
        emoji: '🍣',
        fishColor: 'from-red-600 to-pink-500',
        riceColor: 'white',
        description: 'Intenso y sabroso',
        hasNori: true
    },
    avocado: {
        name: 'Maki Aguacate',
        emoji: '🥑',
        fishColor: 'from-green-400 to-lime-500',
        riceColor: 'white',
        description: 'Vegetariano fresco',
        hasNori: true,
        isMaki: true
    },
    shrimp: {
        name: 'Nigiri Gamba',
        emoji: '🦐',
        fishColor: 'from-pink-400 to-orange-300',
        riceColor: 'white',
        description: 'Dulce y crujiente',
        hasNori: true
    },
    california: {
        name: 'California Roll',
        emoji: '🍱',
        fishColor: 'from-orange-300 to-yellow-400',
        riceColor: 'white',
        description: 'El favorito USA',
        hasNori: false,
        isMaki: true
    },
    temaki: {
        name: 'Temaki',
        emoji: '🌯',
        fishColor: 'from-purple-400 to-pink-400',
        riceColor: 'white',
        description: 'Cono crujiente',
        hasNori: true,
        isTemaki: true
    },
    eel: {
        name: 'Nigiri Anguila',
        emoji: '🍣',
        fishColor: 'from-amber-700 to-yellow-800',
        riceColor: 'white',
        description: 'Glaseado especial',
        hasNori: true
    },
    cucumber: {
        name: 'Maki Pepino',
        emoji: '🥒',
        fishColor: 'from-green-500 to-emerald-600',
        riceColor: 'white',
        description: 'Light y refrescante',
        hasNori: true,
        isMaki: true
    }
};

// Componente del Sushi MEJORADO modo cartoon - SUPER ANIMADO
const SushiCharacter = ({ isHappy, scale = 1, type = 'salmon' }) => {
    const sushi = SUSHI_TYPES[type];
    
    if (sushi.isMaki) {
        // MAKI ROLL - TOON 3D MEJORADO
        return (
            <div 
                className={`relative transition-all duration-300 animate-bounce-gentle toon-3d`}
                style={{ 
                    transform: `perspective(1000px) scale(${isHappy ? scale * 1.3 : scale}) ${isHappy ? 'rotateY(15deg) rotateX(5deg)' : 'rotateY(0deg) rotateX(0deg)'}`,
                    transformStyle: 'preserve-3d'
                }}
            >
                <div className="relative w-40 h-40" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Sombra 3D base */}
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-4 bg-black opacity-20 rounded-full blur-xl"></div>
                    
                    {/* Alga nori exterior con textura 3D */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-full shadow-3d border-4 border-gray-700"
                        style={{ 
                            transform: 'translateZ(0px)',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.4), inset 0 -10px 20px rgba(0,0,0,0.3), inset 0 5px 10px rgba(255,255,255,0.1)'
                        }}
                    ></div>
                    <div className="absolute inset-1 bg-gradient-to-tr from-gray-800 to-gray-700 rounded-full opacity-60" style={{ transform: 'translateZ(2px)' }}></div>
                    
                    {/* Arroz con brillo 3D */}
                    <div 
                        className="absolute inset-2 bg-gradient-to-br from-white via-gray-50 to-white rounded-full shadow-3d-light"
                        style={{ 
                            transform: 'translateZ(5px)',
                            boxShadow: 'inset 0 5px 15px rgba(255,255,255,0.8), inset 0 -5px 10px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.2)'
                        }}
                    ></div>
                    <div className="absolute inset-3 bg-gradient-to-tr from-white to-gray-100 rounded-full opacity-90" style={{ transform: 'translateZ(8px)' }}></div>
                    
                    {/* Relleno central con patrón 3D */}
                    <div 
                        className={`absolute inset-8 bg-gradient-to-br ${sushi.fishColor} rounded-full shadow-lg`}
                        style={{ 
                            transform: 'translateZ(10px)',
                            boxShadow: '0 15px 30px rgba(0,0,0,0.3), inset 0 3px 8px rgba(255,255,255,0.3), inset 0 -3px 8px rgba(0,0,0,0.2)'
                        }}
                    ></div>
                    <div 
                        className={`absolute inset-10 bg-gradient-to-tr ${sushi.fishColor} opacity-70 rounded-full`}
                        style={{ transform: 'translateZ(12px)' }}
                    ></div>
                    
                    {/* Ojos grandes y expresivos con parpadeo 3D */}
                    <div 
                        className="absolute top-10 left-8 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center animate-eye-blink border-4 border-gray-900"
                        style={{ 
                            transform: 'translateZ(15px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div 
                                className={`w-6 h-6 bg-black rounded-full transition-all ${isHappy ? 'scale-125' : ''}`}
                                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                            ></div>
                            {/* Brillo en los ojos 3D */}
                            <div className="absolute top-1 left-2 w-2.5 h-2.5 bg-white rounded-full" style={{ boxShadow: '0 1px 2px rgba(255,255,255,0.8)' }}></div>
                        </div>
                    </div>
                    <div 
                        className="absolute top-10 right-8 w-12 h-12 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center animate-eye-blink delay-100 border-4 border-gray-900"
                        style={{ 
                            transform: 'translateZ(15px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div 
                                className={`w-6 h-6 bg-black rounded-full transition-all ${isHappy ? 'scale-125' : ''}`}
                                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                            ></div>
                            <div className="absolute top-1 right-2 w-2.5 h-2.5 bg-white rounded-full" style={{ boxShadow: '0 1px 2px rgba(255,255,255,0.8)' }}></div>
                        </div>
                    </div>
                    
                    {/* Cejas expresivas 3D */}
                    <div 
                        className="absolute top-8 left-6 w-3 h-1.5 bg-gray-900 rounded-full transform -rotate-12"
                        style={{ transform: 'translateZ(14px) rotate(-12deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                    ></div>
                    <div 
                        className="absolute top-8 right-6 w-3 h-1.5 bg-gray-900 rounded-full transform rotate-12"
                        style={{ transform: 'translateZ(14px) rotate(12deg)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                    ></div>
                    
                    {/* Boca más expresiva 3D */}
                    <div 
                        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all ${
                            isHappy 
                                ? 'w-14 h-8 border-4 border-gray-900 rounded-t-full border-b-0 bg-gradient-to-b from-pink-200 to-pink-300' 
                                : 'w-10 h-1.5 bg-gray-900 rounded-full'
                        }`}
                        style={{ 
                            transform: `translateX(-50%) translateZ(${isHappy ? '13px' : '12px'})`,
                            boxShadow: isHappy ? '0 5px 10px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3)' : '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    ></div>
                    
                    {/* Lengua cuando está feliz 3D */}
                    {isHappy && (
                        <div 
                            className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-4 bg-gradient-to-b from-pink-400 to-pink-500 rounded-t-full"
                            style={{ 
                                transform: 'translateX(-50%) translateZ(14px)',
                                boxShadow: '0 3px 6px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)'
                            }}
                        ></div>
                    )}
                    
                    {/* Mejillas rosadas más grandes */}
                    {isHappy && (
                        <>
                            <div className="absolute top-18 left-4 w-6 h-6 bg-pink-300 rounded-full opacity-80 animate-pulse"></div>
                            <div className="absolute top-18 right-4 w-6 h-6 bg-pink-300 rounded-full opacity-80 animate-pulse delay-200"></div>
                        </>
                    )}
                    
                    {/* Detalles de sésamo animados */}
                    <div className="absolute top-4 left-14 w-2 h-2 bg-amber-300 rounded-full shadow-md animate-pulse"></div>
                    <div className="absolute top-6 right-16 w-2 h-2 bg-amber-300 rounded-full shadow-md animate-pulse delay-300"></div>
                    <div className="absolute bottom-20 left-12 w-2 h-2 bg-amber-300 rounded-full shadow-md animate-pulse delay-500"></div>
                    <div className="absolute bottom-18 right-14 w-2 h-2 bg-amber-300 rounded-full shadow-md animate-pulse delay-100"></div>
                </div>
                <div className="text-center mt-2 text-sm font-bold text-gray-700 animate-wiggle">{sushi.name}</div>
            </div>
        );
    }
    
    // NIGIRI - TOON 3D MEJORADO
    return (
        <div 
            className={`relative transition-all duration-300 animate-bounce-gentle toon-3d`}
            style={{ 
                transform: `perspective(1000px) scale(${isHappy ? scale * 1.3 : scale}) ${isHappy ? 'rotateY(15deg) rotateX(5deg)' : 'rotateY(0deg) rotateX(0deg)'}`,
                transformStyle: 'preserve-3d'
            }}
        >
            <div className="relative w-48 h-36" style={{ transformStyle: 'preserve-3d' }}>
                {/* Sombra 3D base */}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-36 h-3 bg-black opacity-20 rounded-full blur-xl"></div>
                
                {/* Arroz (base) con más textura 3D */}
                <div 
                    className="absolute bottom-0 w-full h-20 bg-gradient-to-br from-white via-gray-50 to-white rounded-3xl border-4 border-gray-300"
                    style={{ 
                        transform: 'translateZ(0px)',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.3), inset 0 5px 15px rgba(255,255,255,0.8), inset 0 -5px 10px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.2)'
                    }}
                >
                    {/* Textura del arroz más detallada */}
                    <div className="absolute inset-2 opacity-30">
                        <div className="absolute top-2 left-4 w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                        <div className="absolute top-5 right-10 w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="absolute bottom-4 left-14 w-2.5 h-2.5 bg-gray-400 rounded-full"></div>
                        <div className="absolute bottom-2 right-8 w-2 h-2 bg-gray-400 rounded-full"></div>
                        <div className="absolute top-8 left-20 w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                    </div>
                    {/* Brillo en el arroz */}
                    <div className="absolute top-1 left-8 w-16 h-3 bg-white opacity-50 rounded-full blur-sm"></div>
                </div>
                
                {/* Pescado (superior) con más detalle 3D */}
                <div 
                    className={`absolute top-0 left-4 right-4 h-24 bg-gradient-to-br ${sushi.fishColor} rounded-3xl border-4 border-white`}
                    style={{ 
                        transform: 'translateZ(8px)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.3), inset 0 3px 8px rgba(255,255,255,0.4), inset 0 -3px 8px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.25)'
                    }}
                >
                    {/* Brillo del pescado más pronunciado 3D */}
                    <div className="absolute top-2 left-10 w-14 h-8 bg-white opacity-60 rounded-full blur-md" style={{ transform: 'translateZ(2px)' }}></div>
                    <div className="absolute top-4 left-12 w-10 h-4 bg-white opacity-80 rounded-full blur-sm" style={{ transform: 'translateZ(3px)' }}></div>
                    
                    {/* Líneas de textura del pescado 3D */}
                    <div className="absolute top-6 left-6 w-16 h-1 bg-white opacity-25 rounded-full" style={{ transform: 'translateZ(1px)', boxShadow: '0 1px 2px rgba(255,255,255,0.3)' }}></div>
                    <div className="absolute top-10 right-8 w-12 h-1 bg-white opacity-25 rounded-full" style={{ transform: 'translateZ(1px)', boxShadow: '0 1px 2px rgba(255,255,255,0.3)' }}></div>
                    
                    {/* Ojos grandes y expresivos 3D */}
                    <div 
                        className="absolute top-4 left-6 w-11 h-11 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center animate-eye-blink border-4 border-gray-900"
                        style={{ 
                            transform: 'translateZ(12px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div 
                                className={`w-5 h-5 bg-black rounded-full transition-all ${isHappy ? 'scale-150' : ''}`}
                                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                            ></div>
                            {/* Brillo en los ojos 3D */}
                            <div className="absolute top-1 left-2 w-2 h-2 bg-white rounded-full" style={{ boxShadow: '0 1px 2px rgba(255,255,255,0.8)' }}></div>
                        </div>
                    </div>
                    <div 
                        className="absolute top-4 right-6 w-11 h-11 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center animate-eye-blink delay-200 border-4 border-gray-900"
                        style={{ 
                            transform: 'translateZ(12px)',
                            boxShadow: '0 10px 20px rgba(0,0,0,0.3), inset 0 2px 5px rgba(255,255,255,0.8), inset 0 -2px 5px rgba(0,0,0,0.2)'
                        }}
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <div 
                                className={`w-5 h-5 bg-black rounded-full transition-all ${isHappy ? 'scale-150' : ''}`}
                                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}
                            ></div>
                            <div className="absolute top-1 right-2 w-2 h-2 bg-white rounded-full" style={{ boxShadow: '0 1px 2px rgba(255,255,255,0.8)' }}></div>
                        </div>
                    </div>
                    
                    {/* Cejas expresivas 3D */}
                    <div 
                        className="absolute top-2 left-4 w-4 h-1.5 bg-gray-900 rounded-full"
                        style={{ 
                            transform: 'translateZ(11px) rotate(-12deg)', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)' 
                        }}
                    ></div>
                    <div 
                        className="absolute top-2 right-4 w-4 h-1.5 bg-gray-900 rounded-full"
                        style={{ 
                            transform: 'translateZ(11px) rotate(12deg)', 
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)' 
                        }}
                    ></div>
                    
                    {/* Boca más expresiva 3D */}
                    <div 
                        className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 transition-all ${
                            isHappy 
                                ? 'w-16 h-8 border-4 border-gray-900 rounded-t-full border-b-0 bg-gradient-to-b from-pink-200 to-pink-300' 
                                : 'w-12 h-1.5 bg-gray-900 rounded-full'
                        }`}
                        style={{ 
                            transform: `translateX(-50%) translateZ(${isHappy ? '10px' : '9px'})`,
                            boxShadow: isHappy ? '0 5px 10px rgba(0,0,0,0.2), inset 0 2px 5px rgba(255,255,255,0.3)' : '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    ></div>
                    
                    {/* Lengua cuando está feliz 3D */}
                    {isHappy && (
                        <div 
                            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-5 bg-gradient-to-b from-pink-400 to-pink-500 rounded-t-full"
                            style={{ 
                                transform: 'translateX(-50%) translateZ(11px)',
                                boxShadow: '0 3px 6px rgba(0,0,0,0.2), inset 0 1px 3px rgba(255,255,255,0.3)'
                            }}
                        ></div>
                    )}
                    
                    {/* Mejillas más grandes */}
                    {isHappy && (
                        <>
                            <div className="absolute top-10 left-2 w-6 h-6 bg-pink-300 rounded-full opacity-80 animate-pulse"></div>
                            <div className="absolute top-10 right-2 w-6 h-6 bg-pink-300 rounded-full opacity-80 animate-pulse delay-300"></div>
                        </>
                    )}
                </div>
                
                {/* Alga nori (tira) con textura */}
                {sushi.hasNori && (
                    <>
                        <div className="absolute top-16 left-0 right-0 h-7 bg-gradient-to-b from-gray-900 to-gray-700 opacity-95 shadow-inner border-y-2 border-gray-600"></div>
                        <div className="absolute top-17 left-2 right-2 h-1 bg-gray-600 opacity-50 rounded-full"></div>
                    </>
                )}
            </div>
            <div className="text-center mt-2 text-sm font-bold text-gray-700 animate-wiggle">{sushi.name}</div>
        </div>
    );
};


// MENÚ PRINCIPAL
const MainMenu = ({ onSelectMode }) => (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-10 left-10 text-5xl animate-pulse">🍱</div>
        <div className="absolute top-20 right-20 text-4xl animate-pulse delay-100">🥢</div>
        <div className="absolute bottom-20 left-20 text-4xl animate-pulse delay-200">🍶</div>
        <div className="absolute bottom-10 right-10 text-5xl animate-pulse delay-300">🍣</div>

        <div className="text-center mb-12 animate-float">
            <div className="text-9xl mb-4">🍣</div>
            <h1 className="text-6xl font-bold text-gray-800 mb-2">Contador de Sushi</h1>
            <p className="text-2xl text-gray-600">¡Elige tu modo de juego!</p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md">
            <button
                onClick={() => onSelectMode('solo')}
                className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-8 px-12 rounded-3xl text-3xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-4"
            >
                <span className="text-5xl">🍣</span>
                <span>Modo Solitario</span>
            </button>

            <button
                onClick={() => onSelectMode('battle')}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-8 px-12 rounded-3xl text-3xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-4"
            >
                <span className="text-5xl">⚔️</span>
                <span>Modo Batalla</span>
            </button>

            <button
                onClick={() => onSelectMode('stats')}
                className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white font-bold py-8 px-12 rounded-3xl text-3xl transition-all transform hover:scale-105 shadow-2xl flex items-center justify-center gap-4"
            >
                <span className="text-5xl">📊</span>
                <span>Estadísticas</span>
            </button>
        </div>

        <div className="mt-12 text-center text-gray-500">
            <p className="text-lg">🔊 Con sonido | 🎨 8 tipos de sushi</p>
        </div>
    </div>
);

// SELECCIÓN DE SUSHI PARA MODO SOLO
const SoloSushiSelection = ({ onSelect }) => {
    const [selectedSushi, setSelectedSushi] = useState(null);

    const handleStart = () => {
        if (selectedSushi) {
            onSelect(selectedSushi);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl font-bold text-gray-800 mb-8">🍣 Elige tu Sushi 🍣</h1>
            
            <div className="grid grid-cols-4 gap-4 mb-8 max-w-3xl">
                {Object.entries(SUSHI_TYPES).map(([key, sushi]) => (
                    <button
                        key={key}
                        onClick={() => setSelectedSushi(key)}
                        className={`p-4 rounded-2xl transition-all transform hover:scale-110 ${
                            selectedSushi === key 
                                ? 'bg-red-500 ring-4 ring-red-600 scale-110 shadow-2xl' 
                                : 'bg-white hover:bg-red-50 shadow-lg'
                        }`}
                    >
                        <div className="text-5xl mb-2">{sushi.emoji}</div>
                        <div className="text-xs font-bold text-gray-800">{sushi.name}</div>
                    </button>
                ))}
            </div>

            <button
                onClick={handleStart}
                disabled={!selectedSushi}
                className={`text-2xl font-bold py-6 px-12 rounded-full transition-all transform ${
                    selectedSushi
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:scale-110 shadow-2xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                ¡Comenzar! 🍱
            </button>
        </div>
    );
};

// PANTALLA DE RESULTADOS MODO SOLO
const SoloResults = ({ count, onReset, onBack }) => {
    const [showConfetti, setShowConfetti] = useState(true);
    
    useEffect(() => {
        // Ocultar confetti después de 3 segundos
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, []);
    
    // Generar confetti
    const confettiItems = [];
    if (showConfetti) {
        for (let i = 0; i < 40; i++) {
            const colors = ['🎉', '⭐', '✨', '🌟', '💫', '🎊', '🍣', '🎈'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            confettiItems.push(
                <div
                    key={i}
                    className="absolute animate-confetti text-4xl"
                    style={{
                        left: `${left}%`,
                        animationDelay: `${delay}s`,
                        top: '-10%'
                    }}
                >
                    {randomColor}
                </div>
            );
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Confetti */}
            {showConfetti && confettiItems}
            
            <div className="text-center relative z-10">
                <div className="text-9xl mb-6 animate-celebration">🍣</div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-celebration delay-200">¡Qué rico!</h1>
                <p className="text-7xl font-bold text-red-500 mb-4 animate-celebration delay-300">{count}</p>
                <p className="text-2xl text-gray-600 mb-8">
                    {count === 1 ? 'pieza de sushi' : 'piezas de sushi'} comidas
                </p>
                
                {/* Mensaje especial según cantidad */}
                {count > 0 && (
                    <div className="mb-8">
                        <p className="text-2xl font-bold text-gray-700 animate-pulse">
                            {count < 5 && "¡Buen comienzo! 😋"}
                            {count >= 5 && count < 10 && "¡Qué apetito! 🤤"}
                            {count >= 10 && count < 20 && "¡Eres todo un experto! 🥢"}
                            {count >= 20 && "¡NIVEL MAESTRO SUSHI! 🏆"}
                        </p>
                    </div>
                )}
                
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onReset}
                        className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 shadow-xl"
                    >
                        Comer más 🍱
                    </button>
                    <button
                        onClick={onBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 shadow-xl"
                    >
                        Menú 🏠
                    </button>
                </div>
            </div>
        </div>
    );
};

// MODO SOLO
const SoloMode = ({ onBack }) => {
    const [stage, setStage] = useState('select');
    const [selectedType, setSelectedType] = useState('salmon');
    const [count, setCount] = useState(0);
    const [isHappy, setIsHappy] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [showSparkle, setShowSparkle] = useState(false);

    const handleCount = () => {
        setCount(count + 1);
        setIsHappy(true);
        setShowSparkle(true);
        SoundSystem.playEat();
        
        setTimeout(() => setIsHappy(false), 500);
        setTimeout(() => setShowSparkle(false), 800);
    };

    const handleFinish = () => {
        setIsFinished(true);
        StatsSystem.addSushi(count);
        StatsSystem.updateBestSolo(count);
        SoundSystem.playWin(); // Sonido de celebración
    };

    const handleReset = () => {
        setCount(0);
        setIsFinished(false);
        setIsHappy(false);
    };

    const handleSushiSelection = (type) => {
        setSelectedType(type);
        setStage('playing');
    };

    if (stage === 'select') {
        return <SoloSushiSelection onSelect={handleSushiSelection} />;
    }

    if (isFinished) {
        return (
            <SoloResults 
                count={count}
                onReset={handleReset}
                onBack={onBack}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-red-50 to-orange-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <button
                onClick={onBack}
                className="absolute top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-all"
            >
                ← Volver
            </button>

            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-700 mb-2">Sushi comidos</h2>
                <div className="text-7xl font-bold text-red-500">{count}</div>
            </div>

            <div className="relative mb-12">
                {showSparkle && (
                    <>
                        <Sparkles className="absolute -top-4 -left-4 text-yellow-400 animate-ping" size={32} />
                        <Sparkles className="absolute -top-4 -right-4 text-yellow-400 animate-ping" size={32} />
                        <Sparkles className="absolute -bottom-4 -left-4 text-yellow-400 animate-ping" size={32} />
                        <Sparkles className="absolute -bottom-4 -right-4 text-yellow-400 animate-ping" size={32} />
                    </>
                )}
                <SushiCharacter isHappy={isHappy} type={selectedType} />
            </div>

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

            {count > 0 && (
                <div className="mt-8 text-center">
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
};

// SELECCIÓN DE SUSHI PARA BATALLA
const SushiSelection = ({ onSelect }) => {
    const [player1Sushi, setPlayer1Sushi] = useState(null);
    const [player2Sushi, setPlayer2Sushi] = useState(null);
    const [player1Name, setPlayer1Name] = useState('Jugador 1');
    const [player2Name, setPlayer2Name] = useState('Jugador 2');

    const handleStart = () => {
        if (player1Sushi && player2Sushi) {
            onSelect(player1Sushi, player2Sushi, player1Name, player2Name);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl font-bold text-gray-800 mb-8">⚔️ Elige tu Sushi ⚔️</h1>

            <div className="flex gap-16 mb-12">
                {/* JUGADOR 1 */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-blue-600 mb-4">Jugador 1</h2>
                    <input
                        type="text"
                        value={player1Name}
                        onChange={(e) => setPlayer1Name(e.target.value || 'Jugador 1')}
                        placeholder="Tu nombre"
                        className="mb-6 px-4 py-2 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:outline-none text-center font-bold text-lg text-gray-800 bg-white shadow-lg"
                        maxLength={20}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(SUSHI_TYPES).map(([key, sushi]) => (
                            <button
                                key={key}
                                onClick={() => setPlayer1Sushi(key)}
                                className={`p-6 rounded-2xl transition-all transform hover:scale-110 ${
                                    player1Sushi === key 
                                        ? 'bg-blue-500 ring-4 ring-blue-600 scale-110' 
                                        : 'bg-white hover:bg-blue-50'
                                } shadow-xl`}
                            >
                                <div className="text-6xl mb-2">{sushi.emoji}</div>
                                <div className="text-sm font-bold text-gray-800">{sushi.name}</div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex items-center">
                    <div className="text-6xl font-bold text-gray-400">VS</div>
                </div>

                {/* JUGADOR 2 */}
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-red-600 mb-4">Jugador 2</h2>
                    <input
                        type="text"
                        value={player2Name}
                        onChange={(e) => setPlayer2Name(e.target.value || 'Jugador 2')}
                        placeholder="Tu nombre"
                        className="mb-6 px-4 py-2 rounded-xl border-2 border-red-400 focus:border-red-600 focus:outline-none text-center font-bold text-lg text-gray-800 bg-white shadow-lg"
                        maxLength={20}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(SUSHI_TYPES).map(([key, sushi]) => (
                            <button
                                key={key}
                                onClick={() => setPlayer2Sushi(key)}
                                className={`p-6 rounded-2xl transition-all transform hover:scale-110 ${
                                    player2Sushi === key 
                                        ? 'bg-red-500 ring-4 ring-red-600 scale-110' 
                                        : 'bg-white hover:bg-red-50'
                                } shadow-xl`}
                            >
                                <div className="text-6xl mb-2">{sushi.emoji}</div>
                                <div className="text-sm font-bold text-gray-800">{sushi.name}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleStart}
                disabled={!player1Sushi || !player2Sushi}
                className={`text-2xl font-bold py-6 px-12 rounded-full transition-all transform ${
                    player1Sushi && player2Sushi
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white hover:scale-110 shadow-2xl'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
            >
                ¡Comenzar Batalla! 🏁
            </button>
        </div>
    );
};

// PANTALLA DE RESULTADOS DE BATALLA
const BattleResults = ({ player1Type, player2Type, player1Name, player2Name, player1Count, player2Count, winner, onReset, onBack }) => {
    const [showConfetti, setShowConfetti] = useState(true);
    const p1Sushi = SUSHI_TYPES[player1Type];
    const p2Sushi = SUSHI_TYPES[player2Type];
    
    useEffect(() => {
        if (winner !== 0) {
            SoundSystem.playWin();
        } else {
            SoundSystem.playTie();
        }
        
        // Ocultar confetti después de 3 segundos
        const timer = setTimeout(() => setShowConfetti(false), 3000);
        return () => clearTimeout(timer);
    }, [winner]);
    
    // Generar confetti
    const confettiItems = [];
    if (showConfetti && winner !== 0) {
        for (let i = 0; i < 30; i++) {
            const colors = ['🎉', '⭐', '✨', '🌟', '💫', '🎊'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            const left = Math.random() * 100;
            const delay = Math.random() * 2;
            confettiItems.push(
                <div
                    key={i}
                    className="absolute animate-confetti text-4xl"
                    style={{
                        left: `${left}%`,
                        animationDelay: `${delay}s`,
                        top: '-10%'
                    }}
                >
                    {randomColor}
                </div>
            );
        }
    }
    
    return (
        <div className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden ${
            winner === 0 
                ? 'bg-gradient-to-br from-gray-100 via-blue-50 to-purple-50' 
                : winner === 1
                ? 'bg-gradient-to-br from-blue-100 via-yellow-50 to-orange-50'
                : 'bg-gradient-to-br from-red-100 via-yellow-50 to-pink-50'
        }`}>
            {/* Confetti para ganador */}
            {showConfetti && winner !== 0 && confettiItems}
            
            <div className="text-center relative z-10">
                {/* Título animado */}
                <div className="mb-8">
                    {winner === 0 ? (
                        <>
                            <div className="text-9xl mb-4 animate-tie-pulse">🤝</div>
                            <h1 className="text-6xl font-bold text-gray-800 mb-2 animate-tie-pulse">
                                ¡EMPATE!
                            </h1>
                            <p className="text-2xl text-gray-600">¡Ambos jugadores son igual de buenos! 🎯</p>
                        </>
                    ) : (
                        <>
                            <div className="text-9xl mb-4 animate-celebration">🏆</div>
                            <h1 className={`text-6xl font-bold mb-2 animate-celebration ${
                                winner === 1 ? 'text-blue-600' : 'text-red-600'
                            }`}>
                                ¡GANADOR!
                            </h1>
                            <p className="text-3xl font-bold text-gray-700 animate-celebration delay-200">
                                {winner === 1 ? player1Name : player2Name} 🎉
                            </p>
                        </>
                    )}
                </div>
                
                {/* Resultados con animaciones */}
                <div className="flex justify-center gap-12 mb-8">
                    <div className={`text-center transition-all duration-500 ${
                        winner === 1 
                            ? 'scale-125 animate-winner-glow bg-gradient-to-br from-blue-400 to-blue-600 p-6 rounded-3xl shadow-2xl' 
                            : winner === 0
                            ? 'scale-100 opacity-80'
                            : 'scale-90 opacity-50'
                    }`}>
                        <div className="text-7xl mb-3 animate-float">{p1Sushi.emoji}</div>
                        <p className={`text-2xl font-bold mb-1 ${
                            winner === 1 ? 'text-white' : 'text-blue-600'
                        }`}>{player1Name}</p>
                        <p className={`text-lg mb-2 ${
                            winner === 1 ? 'text-blue-100' : 'text-gray-600'
                        }`}>{p1Sushi.name}</p>
                        <p className={`text-6xl font-bold ${
                            winner === 1 ? 'text-yellow-300' : 'text-blue-500'
                        }`}>{player1Count}</p>
                        {winner === 1 && (
                            <div className="mt-3 text-3xl animate-rainbow">⭐</div>
                        )}
                    </div>
                    
                    <div className={`text-6xl flex items-center font-bold ${
                        winner === 0 ? 'text-gray-600 animate-tie-pulse' : 'text-gray-400'
                    }`}>VS</div>
                    
                    <div className={`text-center transition-all duration-500 ${
                        winner === 2 
                            ? 'scale-125 animate-winner-glow bg-gradient-to-br from-red-400 to-red-600 p-6 rounded-3xl shadow-2xl' 
                            : winner === 0
                            ? 'scale-100 opacity-80'
                            : 'scale-90 opacity-50'
                    }`}>
                        <div className="text-7xl mb-3 animate-float">{p2Sushi.emoji}</div>
                        <p className={`text-2xl font-bold mb-1 ${
                            winner === 2 ? 'text-white' : 'text-red-600'
                        }`}>{player2Name}</p>
                        <p className={`text-lg mb-2 ${
                            winner === 2 ? 'text-red-100' : 'text-gray-600'
                        }`}>{p2Sushi.name}</p>
                        <p className={`text-6xl font-bold ${
                            winner === 2 ? 'text-yellow-300' : 'text-red-500'
                        }`}>{player2Count}</p>
                        {winner === 2 && (
                            <div className="mt-3 text-3xl animate-rainbow">⭐</div>
                        )}
                    </div>
                </div>
                
                {/* Mensaje especial */}
                {winner !== 0 && (
                    <div className="mb-8">
                        <p className="text-2xl font-bold text-gray-700 animate-pulse">
                            {winner === 1 
                                ? `🎊 ¡${player1Name} es el campeón del sushi! 🎊` 
                                : `🎊 ¡${player2Name} es el campeón del sushi! 🎊`}
                        </p>
                    </div>
                )}

                {/* Botones */}
                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onReset}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 shadow-xl"
                    >
                        Nueva Batalla ⚔️
                    </button>
                    <button
                        onClick={onBack}
                        className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105 shadow-xl"
                    >
                        Menú 🏠
                    </button>
                </div>
            </div>
        </div>
    );
};

// MODO BATALLA
const BattleMode = ({ onBack }) => {
    const [stage, setStage] = useState('select');
    const [player1Type, setPlayer1Type] = useState(null);
    const [player2Type, setPlayer2Type] = useState(null);
    const [player1Name, setPlayer1Name] = useState('Jugador 1');
    const [player2Name, setPlayer2Name] = useState('Jugador 2');
    const [player1Count, setPlayer1Count] = useState(0);
    const [player2Count, setPlayer2Count] = useState(0);
    const [player1Happy, setPlayer1Happy] = useState(false);
    const [player2Happy, setPlayer2Happy] = useState(false);
    const [showSparkle1, setShowSparkle1] = useState(false);
    const [showSparkle2, setShowSparkle2] = useState(false);
    const [battleActive, setBattleActive] = useState(true);

    const handleSushiSelection = (p1, p2, name1, name2) => {
        setPlayer1Type(p1);
        setPlayer2Type(p2);
        setPlayer1Name(name1 || 'Jugador 1');
        setPlayer2Name(name2 || 'Jugador 2');
        setStage('battle');
        setBattleActive(true);
    };

    const handlePlayer1 = () => {
        if (!battleActive) return;
        setPlayer1Count(player1Count + 1);
        setPlayer1Happy(true);
        setShowSparkle1(true);
        SoundSystem.playEat();
        setTimeout(() => setPlayer1Happy(false), 500);
        setTimeout(() => setShowSparkle1(false), 800);
    };

    const handlePlayer2 = () => {
        if (!battleActive) return;
        setPlayer2Count(player2Count + 1);
        setPlayer2Happy(true);
        setShowSparkle2(true);
        SoundSystem.playEat();
        setTimeout(() => setPlayer2Happy(false), 500);
        setTimeout(() => setShowSparkle2(false), 800);
    };

    const handleFinish = () => {
        setBattleActive(false);
        setStage('finished');
        StatsSystem.addBattle(winner);
        StatsSystem.addSushi(player1Count + player2Count);
    };

    const handleReset = () => {
        setPlayer1Count(0);
        setPlayer2Count(0);
        setStage('select');
        setBattleActive(true);
    };

    const winner = player1Count > player2Count ? 1 : player2Count > player1Count ? 2 : 0;

    if (stage === 'select') {
        return <SushiSelection onSelect={handleSushiSelection} />;
    }

    if (stage === 'finished') {
        return (
            <BattleResults
                player1Type={player1Type}
                player2Type={player2Type}
                player1Name={player1Name}
                player2Name={player2Name}
                player1Count={player1Count}
                player2Count={player2Count}
                winner={winner}
                onReset={handleReset}
                onBack={onBack}
            />
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-red-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            <button
                onClick={onBack}
                className="absolute top-4 left-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full transition-all z-10"
            >
                ← Volver
            </button>

            <div className="text-center mb-6">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">⚔️ BATALLA DE SUSHI ⚔️</h1>
            </div>

            <div className="flex gap-8 items-start justify-center mb-8">
                {/* JUGADOR 1 */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-blue-600 mb-4">{player1Name}</h3>
                    <div className="text-5xl font-bold text-blue-500 mb-4">{player1Count}</div>
                    
                    <div className="relative mb-6">
                        {showSparkle1 && (
                            <>
                                <Sparkles className="absolute -top-4 -left-4 text-blue-400 animate-ping" size={32} />
                                <Sparkles className="absolute -top-4 -right-4 text-blue-400 animate-ping" size={32} />
                            </>
                        )}
                        <SushiCharacter isHappy={player1Happy} scale={0.7} type={player1Type} />
                    </div>

                    <button
                        onClick={handlePlayer1}
                        disabled={!battleActive}
                        className={`font-bold py-4 px-8 rounded-full text-xl transition-all transform shadow-xl ${
                            battleActive
                                ? 'bg-blue-500 hover:bg-blue-600 text-white hover:scale-110 active:scale-95'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                    >
                        Comer 🍣
                    </button>
                </div>

                {/* VS */}
                <div className="text-6xl font-bold text-gray-400 animate-pulse flex items-center mt-32">VS</div>

                {/* JUGADOR 2 */}
                <div className="text-center">
                    <h3 className="text-2xl font-bold text-red-600 mb-4">{player2Name}</h3>
                    <div className="text-5xl font-bold text-red-500 mb-4">{player2Count}</div>
                    
                    <div className="relative mb-6">
                        {showSparkle2 && (
                            <>
                                <Sparkles className="absolute -top-4 -left-4 text-red-400 animate-ping" size={32} />
                                <Sparkles className="absolute -top-4 -right-4 text-red-400 animate-ping" size={32} />
                            </>
                        )}
                        <SushiCharacter isHappy={player2Happy} scale={0.7} type={player2Type} />
                    </div>

                    <button
                        onClick={handlePlayer2}
                        disabled={!battleActive}
                        className={`font-bold py-4 px-8 rounded-full text-xl transition-all transform shadow-xl ${
                            battleActive
                                ? 'bg-red-500 hover:bg-red-600 text-white hover:scale-110 active:scale-95'
                                : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                        }`}
                    >
                        Comer 🍣
                    </button>
                </div>
            </div>

            {battleActive && (player1Count > 0 || player2Count > 0) && (
                <button
                    onClick={handleFinish}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 px-12 rounded-full text-xl transition-all transform hover:scale-105 shadow-lg"
                >
                    Terminar Ahora 🏁
                </button>
            )}
        </div>
    );
};

// SISTEMA DE ESTADÍSTICAS
const StatsSystem = {
    getStats: () => {
        const stats = localStorage.getItem('sushiStats');
        return stats ? JSON.parse(stats) : {
            totalSushi: 0,
            totalBattles: 0,
            wins: 0,
            bestSolo: 0,
        };
    },
    saveStats: (stats) => {
        localStorage.setItem('sushiStats', JSON.stringify(stats));
    },
    addSushi: (count) => {
        const stats = StatsSystem.getStats();
        stats.totalSushi += count;
        StatsSystem.saveStats(stats);
    },
    addBattle: (winner) => {
        const stats = StatsSystem.getStats();
        stats.totalBattles++;
        if (winner !== 0) stats.wins++;
        StatsSystem.saveStats(stats);
    },
    updateBestSolo: (count) => {
        const stats = StatsSystem.getStats();
        if (count > stats.bestSolo) {
            stats.bestSolo = count;
            StatsSystem.saveStats(stats);
        }
    },
};

// PANTALLA DE ESTADÍSTICAS
const StatsScreen = ({ onBack }) => {
    const stats = StatsSystem.getStats();
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-2xl w-full">
                <h1 className="text-5xl font-bold text-gray-800 mb-8 text-center">📊 Estadísticas</h1>
                
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-red-100 to-orange-100 p-6 rounded-2xl text-center">
                        <div className="text-4xl mb-2">🍣</div>
                        <div className="text-3xl font-bold text-red-600">{stats.totalSushi}</div>
                        <div className="text-sm text-gray-600">Total Sushi</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-6 rounded-2xl text-center">
                        <div className="text-4xl mb-2">⚔️</div>
                        <div className="text-3xl font-bold text-purple-600">{stats.totalBattles}</div>
                        <div className="text-sm text-gray-600">Batallas</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-yellow-100 to-amber-100 p-6 rounded-2xl text-center">
                        <div className="text-4xl mb-2">🏆</div>
                        <div className="text-3xl font-bold text-yellow-600">{stats.bestSolo}</div>
                        <div className="text-sm text-gray-600">Mejor Solo</div>
                    </div>
                    
                </div>
                
                <button
                    onClick={onBack}
                    className="mt-8 w-full bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-full text-xl transition-all transform hover:scale-105"
                >
                    Volver al Menú 🏠
                </button>
            </div>
        </div>
    );
};

// APP PRINCIPAL
function SushiCounterApp() {
    const [mode, setMode] = useState('menu');

    return (
        <>
            {mode === 'menu' && <MainMenu onSelectMode={setMode} />}
            {mode === 'solo' && <SoloMode onBack={() => setMode('menu')} />}
            {mode === 'battle' && <BattleMode onBack={() => setMode('menu')} />}
            {mode === 'stats' && <StatsScreen onBack={() => setMode('menu')} />}
        </>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<SushiCounterApp />);

