# Faro Shuffle Visualization

An interactive web application built with Next.js, React, and Tailwind CSS that demonstrates how the Faro shuffle card shuffling technique works.

## Features

- Interactive visualization of both In-Shuffle and Out-Shuffle techniques
- Adjustable deck size from 4 to 20 cards
- Real-time animation showing deck splitting and interleaving
- Displays the number of shuffles needed to restore the original deck order
- Educational information about the mathematical properties of Faro shuffles

## What is a Faro Shuffle?

A Faro shuffle is a method of shuffling playing cards where the deck is split into two equal halves and the cards are perfectly interleaved. There are two types:

- **In-Shuffle**: The second half cards are placed first, moving the original top card to the second position
- **Out-Shuffle**: The first half cards are placed first, keeping the top and bottom cards in their original positions

### Mathematical Properties

- A standard 52-card deck requires only 8 out-shuffles to restore the original order
- The same 52-card deck requires 52 in-shuffles to restore the original order
- For any even-sized deck, the number of shuffles needed follows predictable mathematical patterns based on modular arithmetic

#### Binary Representation

Each out-shuffle can be viewed as a left shift in binary representation. For example, in a 52-card deck:
- A card at position 13 (binary: 001101) moves to position 26 (binary: 011010) after one shuffle
- After 8 shuffles, it returns to position 13 because 8 bits cycles through all positions mod 51
- Moving a card exactly 26 places in a 52-card deck is represented by the binary sequence 011010, which requires specific shuffle operations to achieve

## Getting Started

### Prerequisites

- Node.js 18+ installed on your system
- npm or yarn package manager

### Installation

1. Clone or navigate to this directory:
```bash
cd faro-shuffle-demo
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

## How to Use

1. **Adjust Deck Size**: Use the slider to change the number of cards (must be even)
2. **Select Shuffle Type**: Choose between In-Shuffle or Out-Shuffle
3. **Shuffle**: Click the "Shuffle" button to perform a shuffle
4. **Watch**: The deck will split into two halves and interleave with animation
5. **Track Progress**: See how many shuffles you've performed and how many are needed to restore the original order
6. **Reset**: Click "Reset" to return the deck to its original state

## Technical Stack

- **Next.js 15**: React framework with App Router
- **React 19**: UI library with hooks for state management
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework for styling

## Project Structure

```
faro-shuffle-demo/
├── app/
│   ├── layout.tsx        # Root layout with metadata
│   ├── page.tsx          # Main application with shuffle logic
│   └── globals.css       # Global styles
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Shuffle Algorithms

### In-Shuffle Algorithm
```typescript
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
```

### Out-Shuffle Algorithm
```typescript
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
```

## Building for Production

To create an optimized production build:

```bash
npm run build
npm run start
```

## License

This project is open source and available for educational purposes.
