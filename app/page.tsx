'use client';

import { useState, useEffect } from 'react';
import SplitText from '@/components/SplitText';
import Shuffle from '@/components/Shuffle';
import ShinyText from '@/components/ShinyText';
import Aurora from '@/components/Aurora';

interface Card {
  id: number;
  value: string;
  suit: string;
  color: string;
}

const suits = [
  { symbol: '♥', name: 'hearts', color: 'text-red-500' },
  { symbol: '♠', name: 'spades', color: 'text-black' }
];

function createDeck(size: number): Card[] {
  const deck: Card[] = [];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
  
  for (let i = 0; i < size; i++) {
    const suitIndex = i < size / 2 ? 0 : 1;
    const suit = suits[suitIndex];
    const valueIndex = i % (size / 2);
    
    deck.push({
      id: i,
      value: values[valueIndex % values.length],
      suit: suit.symbol,
      color: suit.color
    });
  }
  
  return deck;
}

function inShuffle(deck: Card[]): Card[] {
  const mid = deck.length / 2;
  const firstHalf = deck.slice(0, mid);
  const secondHalf = deck.slice(mid);
  const result: Card[] = [];
  
  for (let i = 0; i < mid; i++) {
    result.push(secondHalf[i]);
    result.push(firstHalf[i]);
  }
  
  return result;
}

function outShuffle(deck: Card[]): Card[] {
  const mid = deck.length / 2;
  const firstHalf = deck.slice(0, mid);
  const secondHalf = deck.slice(mid);
  const result: Card[] = [];
  
  for (let i = 0; i < mid; i++) {
    result.push(firstHalf[i]);
    result.push(secondHalf[i]);
  }
  
  return result;
}

function calculateShufflesToRestore(deckSize: number, isInShuffle: boolean): number {
  const originalDeck = createDeck(deckSize);
  let currentDeck = [...originalDeck];
  let count = 0;
  
  // Do the first shuffle
  currentDeck = isInShuffle ? inShuffle(currentDeck) : outShuffle(currentDeck);
  count = 1;
  
  // Continue until we're back to original
  while (JSON.stringify(currentDeck) !== JSON.stringify(originalDeck) && count < 1000) {
    currentDeck = isInShuffle ? inShuffle(currentDeck) : outShuffle(currentDeck);
    count++;
  }
  
  return count;
}

function calculateBinaryDecomposition(deckSize: number): { outshuffles: number, inshuffles: number } {
  const totalShuffles = calculateShufflesToRestore(deckSize, false);
  const originalDeck = createDeck(deckSize);
  
  // The binary decomposition: we want to express the total number of outshuffles
  // as a combination of outshuffles and inshuffles
  // Key insight: inshuffles and outshuffles are related by the fact that
  // an inshuffle followed by an outshuffle (or vice versa) can be equivalent to multiple outshuffles
  
  // For small deck sizes, let's find the optimal combination
  let bestOut = totalShuffles;
  let bestIn = 0;
  
  // Try all combinations where out + in = totalShuffles
  for (let out = 0; out <= totalShuffles; out++) {
    const in_ = totalShuffles - out;
    
    // Test this combination
    let testDeck = [...originalDeck];
    
    // Apply outshuffles first
    for (let i = 0; i < out; i++) {
      testDeck = outShuffle(testDeck);
    }
    
    // Then apply inshuffles
    for (let i = 0; i < in_; i++) {
      testDeck = inShuffle(testDeck);
    }
    
    // Check if we're back to original order
    if (JSON.stringify(testDeck) === JSON.stringify(originalDeck)) {
      // Prefer combinations with fewer total shuffles or more outshuffles
      if (out + in_ < bestOut + bestIn || (out + in_ === bestOut + bestIn && out > bestOut)) {
        bestOut = out;
        bestIn = in_;
      }
    }
  }
  
  return { outshuffles: bestOut, inshuffles: bestIn };
}

export default function Home() {
  const [deckSize, setDeckSize] = useState(52);
  const [deck, setDeck] = useState<Card[]>([]);
  const [shuffleType, setShuffleType] = useState<'in' | 'out'>('out');
  const [shuffleCount, setShuffleCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSplit, setShowSplit] = useState(false);
  const [shufflesToRestore, setShufflesToRestore] = useState(0);
  const [autoShuffle, setAutoShuffle] = useState(false);

  useEffect(() => {
    const newDeck = createDeck(deckSize);
    setDeck(newDeck);
    setShuffleCount(0);
    setShufflesToRestore(calculateShufflesToRestore(deckSize, shuffleType === 'in'));
  }, [deckSize]);

  useEffect(() => {
    setShufflesToRestore(calculateShufflesToRestore(deckSize, shuffleType === 'in'));
  }, [shuffleType, deckSize]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (autoShuffle && !isAnimating) {
      interval = setInterval(() => {
        handleShuffle();
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [autoShuffle, isAnimating]);

  const handleShuffle = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setShowSplit(true);
    
    setTimeout(() => {
      const shuffled = shuffleType === 'in' ? inShuffle(deck) : outShuffle(deck);
      setDeck(shuffled);
      setShuffleCount(prev => prev + 1);
      setShowSplit(false);
      setIsAnimating(false);
    }, 800);
  };

  const handleReset = () => {
    setAutoShuffle(false);
    const newDeck = createDeck(deckSize);
    setDeck(newDeck);
    setShuffleCount(0);
    setShowSplit(false);
  };

  const mid = deck.length / 2;
  const firstHalf = deck.slice(0, mid);
  const secondHalf = deck.slice(mid);

  const isRestored = shuffleCount > 0 && shuffleCount === shufflesToRestore;

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 z-0">
        <Aurora
          colorStops={['#3A29FF', '#FF94B4', '#FF3232']}
          speed={0.8}
          blend={0.3}
          amplitude={1.0}
        />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-16 pt-12">
          <div className="space-y-6">
            <h1 className="text-8xl font-black bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 bg-clip-text text-transparent tracking-tight leading-none">
              FARO SHUFFLE
            </h1>
            <div className="flex items-center justify-center space-x-4">
              <div className="h-0.5 w-16 bg-gradient-to-r from-transparent to-purple-300"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="h-0.5 w-16 bg-gradient-to-l from-transparent to-blue-300"></div>
            </div>
            <ShinyText 
              text="The Perfect Mathematical Card Shuffle" 
              className="text-2xl font-light text-white/90 drop-shadow-lg tracking-wide"
              speed={4}
            />
          </div>
        </div>


        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-200 shadow-xl shadow-purple-200/30 mb-8">
          <h2 className="text-3xl font-bold text-purple-700 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            Key Facts
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-700 mb-2">Perfect Restoration</h3>
              <p className="text-purple-900">A Faro shuffle always returns a deck to its original order after a specific number of iterations</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-700 mb-2">Two Types</h3>
              <p className="text-blue-900">In-shuffle: bottom card moves up. Out-shuffle: top and bottom cards stay in place</p>
            </div>
            <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-5 border border-pink-200">
              <h3 className="text-lg font-bold text-pink-700 mb-2">52-Card Standard</h3>
              <p className="text-pink-900">8 out-shuffles or 52 in-shuffles restore a standard 52-card deck</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-700 mb-2">Magician's Tool</h3>
              <p className="text-purple-900">Can move any card to any position using binary sequences of shuffles</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-100/90 to-purple-100/90 backdrop-blur-xl rounded-3xl p-8 border border-pink-300/50 shadow-2xl shadow-pink-200/30 mb-8">
          <div className="mb-6">
            <h2 className="text-3xl font-black text-purple-700">
              Introduction to Faro Shuffle
            </h2>
          </div>
          
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p className="text-lg">
              The <span className="font-bold text-purple-600">Faro shuffle</span> is a perfect riffle shuffle technique where a deck 
              is split in half and the cards are perfectly interleaved one at a time from each half. Unlike random shuffles, 
              it produces a completely predictable result every time.
            </p>
            
            <p>
              Named after the card game <span className="font-bold text-pink-600">Faro</span>, a popular gambling game in the American Old West, 
              this shuffle technique was essential for dealers who needed to split and recombine the deck precisely after each round.
            </p>

            <p>
              Also known as the <span className="font-bold text-purple-600">weave shuffle</span> in Britain and 
              the <span className="font-bold text-purple-600">dovetail shuffle</span>, the technique gets its name from the way 
              cards interleave like interlocking fingers or a woven pattern.
            </p>

            <div className="bg-gradient-to-r from-pink-200 to-rose-200 rounded-xl p-4 border-l-4 border-pink-400 shadow-sm">
              <p className="font-semibold text-pink-600 mb-2">Historical Discovery</p>
              <p className="text-sm text-gray-700">
                First documented by magician John Maskelyne, though it was already in use by Faro dealers. 
                Later research by mathematician and magician Persi Diaconis uncovered its earlier association with the game 
                and revealed its remarkable mathematical properties.
              </p>
            </div>

            <div className="bg-gradient-to-r from-lavender-200 to-purple-200 rounded-xl p-4 border border-purple-300 shadow-sm">
              <p className="font-bold text-purple-600 mb-2">Why It Matters</p>
              <p className="text-sm text-gray-700">
                Unlike random shuffles, a perfect Faro shuffle always returns a deck to its original order after a specific 
                number of iterations. This predictability makes it invaluable for card magic and mathematical research, while 
                making it useless for actual card game randomization.
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-200 shadow-xl shadow-purple-200/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-700 flex items-center gap-3">
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
                Deck Visualization
              </h2>
              {isRestored && (
                <div className="px-4 py-2 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full text-green-800 font-bold text-sm animate-bounce">
                  RESTORED!
                </div>
              )}
            </div>
            
            {!showSplit ? (
              <div className="bg-purple-50/50 rounded-2xl p-6 min-h-[500px] flex items-center justify-center">
                <div className={`flex flex-wrap gap-2 justify-center ${deckSize > 30 ? 'max-h-[600px] overflow-y-auto' : ''}`}>
                  {deck.map((card, index) => (
                    <div
                      key={`${card.id}-${index}`}
                      className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl p-2 flex flex-col items-center justify-center transition-all duration-500 hover:scale-110 hover:rotate-3 cursor-pointer border-2 border-gray-300"
                      style={{
                        width: deckSize > 40 ? '48px' : deckSize > 20 ? '56px' : '64px',
                        height: deckSize > 40 ? '72px' : deckSize > 20 ? '84px' : '96px',
                        transform: `translateY(${isAnimating ? -10 : 0}px) rotate(${Math.random() * 2 - 1}deg)`,
                      }}
                    >
                      <div className={`${deckSize > 40 ? 'text-sm' : deckSize > 20 ? 'text-lg' : 'text-2xl'} font-black ${card.color}`}>{card.value}</div>
                      <div className={`${deckSize > 40 ? 'text-lg' : deckSize > 20 ? 'text-2xl' : 'text-3xl'} ${card.color}`}>{card.suit}</div>
                      <div className="text-[10px] text-gray-400 font-medium mt-1">#{index + 1}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-6 border border-blue-300">
                  <h3 className="text-lg font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-400 rounded-full"></span>
                    First Half
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {firstHalf.map((card, index) => (
                      <div
                        key={`${card.id}-${index}`}
                        className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl p-2 flex flex-col items-center justify-center transition-all duration-500 border-2 border-blue-300"
                        style={{
                          width: deckSize > 40 ? '48px' : deckSize > 20 ? '56px' : '64px',
                          height: deckSize > 40 ? '72px' : deckSize > 20 ? '84px' : '96px',
                          transform: 'translateY(-20px)',
                        }}
                      >
                        <div className={`${deckSize > 40 ? 'text-sm' : deckSize > 20 ? 'text-lg' : 'text-2xl'} font-black ${card.color}`}>{card.value}</div>
                        <div className={`${deckSize > 40 ? 'text-lg' : deckSize > 20 ? 'text-2xl' : 'text-3xl'} ${card.color}`}>{card.suit}</div>
                        <div className="text-[10px] text-gray-400 font-medium mt-1">#{index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-6 border border-pink-300">
                  <h3 className="text-lg font-bold text-pink-700 mb-4 flex items-center gap-2">
                    <span className="w-3 h-3 bg-pink-400 rounded-full"></span>
                    Second Half
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {secondHalf.map((card, index) => (
                      <div
                        key={`${card.id}-${index}`}
                        className="bg-gradient-to-br from-white to-gray-100 rounded-xl shadow-xl p-2 flex flex-col items-center justify-center transition-all duration-500 border-2 border-pink-300"
                        style={{
                          width: deckSize > 40 ? '48px' : deckSize > 20 ? '56px' : '64px',
                          height: deckSize > 40 ? '72px' : deckSize > 20 ? '84px' : '96px',
                          transform: 'translateY(20px)',
                        }}
                      >
                        <div className={`${deckSize > 40 ? 'text-sm' : deckSize > 20 ? 'text-lg' : 'text-2xl'} font-black ${card.color}`}>{card.value}</div>
                        <div className={`${deckSize > 40 ? 'text-lg' : deckSize > 20 ? 'text-2xl' : 'text-3xl'} ${card.color}`}>{card.suit}</div>
                        <div className="text-[10px] text-gray-400 font-medium mt-1">#{mid + index + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-200 shadow-xl shadow-purple-200/30">
              <h3 className="text-xl font-bold text-purple-700 mb-4">Controls</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-purple-600 mb-2 font-semibold text-sm">
                    Deck Size: <span className="text-purple-800 text-lg">{deckSize}</span>
                  </label>
                  <input
                    type="range"
                    min="4"
                    max="52"
                    step="2"
                    value={deckSize}
                    onChange={(e) => setDeckSize(parseInt(e.target.value))}
                    className="w-full h-3 bg-purple-100 rounded-lg appearance-none cursor-pointer accent-purple-400"
                    disabled={isAnimating}
                  />
                </div>

                <div>
                  <label className="block text-purple-600 mb-2 font-semibold text-sm">Shuffle Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setShuffleType('in')}
                      disabled={isAnimating}
                      className={`px-4 py-3 rounded-xl font-bold transition-all ${
                        shuffleType === 'in'
                          ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-purple-800 shadow-lg shadow-purple-300/50 scale-105'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                      }`}
                    >
                      IN
                    </button>
                    <button
                      onClick={() => setShuffleType('out')}
                      disabled={isAnimating}
                      className={`px-4 py-3 rounded-xl font-bold transition-all ${
                        shuffleType === 'out'
                          ? 'bg-gradient-to-r from-purple-300 to-pink-300 text-purple-800 shadow-lg shadow-purple-300/50 scale-105'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                      }`}
                    >
                      OUT
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleShuffle}
                    disabled={isAnimating}
                    className="px-6 py-4 bg-gradient-to-r from-green-200 to-emerald-200 hover:from-green-300 hover:to-emerald-300 disabled:from-gray-200 disabled:to-gray-300 text-green-800 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100"
                  >
                    SHUFFLE
                  </button>
                  <button
                    onClick={handleReset}
                    disabled={isAnimating}
                    className="px-6 py-4 bg-gradient-to-r from-red-200 to-rose-200 hover:from-red-300 hover:to-rose-300 disabled:from-gray-200 disabled:to-gray-300 text-red-800 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 disabled:scale-100"
                  >
                    RESET
                  </button>
                </div>

                <button
                  onClick={() => setAutoShuffle(!autoShuffle)}
                  disabled={isAnimating}
                  className={`w-full px-6 py-4 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 ${
                    autoShuffle
                      ? 'bg-gradient-to-r from-orange-200 to-amber-200 text-orange-800'
                      : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  {autoShuffle ? 'STOP AUTO' : 'AUTO SHUFFLE'}
                </button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 border border-purple-200 shadow-xl shadow-purple-200/30">
              <h3 className="text-xl font-bold text-purple-700 mb-4">Stats</h3>
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="text-sm text-purple-600 font-medium">Shuffles Done</div>
                  <div className="text-4xl font-black text-purple-800 mt-1">{shuffleCount}</div>
                </div>
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="text-sm text-pink-600 font-medium">Outshuffles Needed</div>
                  <div className="text-4xl font-black text-pink-800 mt-1">{calculateBinaryDecomposition(deckSize).outshuffles}</div>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="text-sm text-blue-600 font-medium">Inshuffles Needed</div>
                  <div className="text-4xl font-black text-blue-800 mt-1">{calculateBinaryDecomposition(deckSize).inshuffles}</div>
                </div>
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-sm text-green-600 font-medium">Progress</div>
                  <div className="w-full bg-purple-100 rounded-full h-3 mt-2">
                    <div 
                      className="bg-gradient-to-r from-purple-300 to-pink-300 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((shuffleCount / shufflesToRestore) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-purple-200 shadow-xl shadow-purple-200/30 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-4xl">🧮</span>
            <Shuffle 
              text="Mathematical Explanation" 
              tag="h2"
              className="text-3xl font-black text-purple-700"
              shuffleDirection="left"
              duration={0.4}
              shuffleTimes={3}
              scrambleCharset="0123456789+-×÷=∞πΣ∫"
              threshold={0.5}
            />
          </div>
          
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-purple-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-400 rounded-full"></span>
                  In-Shuffle
                </h3>
                <p className="text-base md:text-lg text-purple-700 mb-3">
                  Cards from the second half are placed first, moving the original top card to the second position.
                </p>
                <div className="bg-purple-50 rounded-xl p-4">
                  <div className="font-mono text-sm md:text-base text-purple-600">
                    For a {deckSize}-card deck: <span className="font-bold text-purple-800 text-base md:text-lg">{calculateShufflesToRestore(deckSize, true)}</span> shuffles to restore
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-pink-600 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  Out-Shuffle
                </h3>
                <p className="text-base md:text-lg text-purple-700 mb-3">
                  Cards from the first half are placed first, keeping the top and bottom cards in their original positions.
                </p>
                <div className="bg-pink-50 rounded-xl p-4">
                  <div className="font-mono text-sm md:text-base text-pink-600">
                    For a {deckSize}-card deck: <span className="font-bold text-pink-800 text-base md:text-lg">{calculateShufflesToRestore(deckSize, false)}</span> shuffles to restore
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl p-6 border border-purple-300">
              <h3 className="text-lg md:text-xl font-bold text-purple-800 mb-4">The Formulas</h3>
              <div className="space-y-4 text-purple-700">
                <div>
                  <p className="font-bold text-purple-600 mb-2">In-Shuffle:</p>
                  <p className="text-sm md:text-base mb-2">
                    A deck of n cards returns to original order after k in-shuffles when:
                  </p>
                  <div className="bg-purple-50 rounded-lg p-3 font-mono text-purple-600 text-center text-lg md:text-xl">
                    2^k ≡ 1 (mod n+1)
                  </div>
                  <p className="text-xs md:text-sm mt-2 text-purple-600">
                    This means finding the smallest k where 2^k leaves a remainder of 1 when divided by (n+1)
                  </p>
                </div>
                <div>
                  <p className="font-bold text-purple-600 mb-2">Out-Shuffle:</p>
                  <p className="text-sm md:text-base mb-2">
                    A deck of n cards returns to original order after k out-shuffles when:
                  </p>
                  <div className="bg-pink-50 rounded-lg p-3 font-mono text-pink-600 text-center text-lg md:text-xl">
                    2^k ≡ 1 (mod n-1)
                  </div>
                  <p className="text-xs md:text-sm mt-2 text-purple-600">
                    This means finding the smallest k where 2^k leaves a remainder of 1 when divided by (n-1)
                  </p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-400">
                <p className="font-bold text-green-700 mb-2">Standard 52-Card Deck</p>
                <p className="text-green-600 text-sm md:text-base">
                  Requires only <span className="font-bold text-green-800">8 out-shuffles</span> or{' '}
                  <span className="font-bold text-green-800">52 in-shuffles</span> to return to its original order.
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-300">
                <p className="font-bold text-purple-700 mb-2">Binary Card Positioning</p>
                <p className="text-sm md:text-base text-purple-600 mb-3">
                  Magician Alex Elmsley discovered you can move any card to any position by expressing the position in binary 
                  and performing in-shuffles for 1s and out-shuffles for 0s.
                </p>
                <div className="bg-purple-50 rounded-lg p-3 text-xs md:text-sm text-purple-600">
                  <p className="mb-2"><strong>Example:</strong> Moving a card exactly 26 places in a 52-card deck</p>
                  <p>Position 26 in binary: <span className="font-mono text-purple-700">011010</span></p>
                  <p>This requires: Out-Out-In-Out-In-Out shuffles (reading right to left)</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-5 border-l-4 border-blue-400">
              <p className="font-bold text-blue-700 mb-3">Why This Matters</p>
              <p className="text-blue-600 text-sm md:text-base">
                The Faro shuffle demonstrates a fascinating intersection of combinatorics, group theory, and modular arithmetic. 
                Each shuffle is a permutation, and repeated shuffles form a cyclic group. The restoration number is the order of 
                this permutation in the symmetric group. This predictability makes it useless for randomization but invaluable 
                for card magic and studying permutation properties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
