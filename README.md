# Brolex - Luxury Watches That Almost Work

A satirical luxury watch storefront built with Next.js, featuring an AI concierge powered by ElevenLabs. This is a parody e-commerce experience that showcases beautiful design while poking fun at luxury watch culture.

## 🚀 Features

- **Shopify-inspired Design**: Clean, modern storefront with luxury aesthetics
- **Product Grid**: 6 parody luxury watches with humorous descriptions
- **AI Concierge**: ElevenLabs-powered voice agent for customer service
- **Responsive Design**: Mobile-first approach with smooth animations
- **Toast Notifications**: Humorous feedback for user interactions
- **Never Actually Sells**: All cart interactions are purely satirical

## 🛠️ Tech Stack

- **Next.js 13** (Pages Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hot Toast**
- **Lucide React** (Icons)
- **ElevenLabs Agent Mode**

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Add your ElevenLabs credentials to `.env.local`:
   ```
   NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key_here
   NEXT_PUBLIC_AGENT_ID=your_agent_id_here
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## 🎭 The Collection

### Our Distinguished Timepieces:

1. **Subwrecker** - "Water-resistant up to three lattes." - $9,999
2. **Datejust-ish** - "Knows the date… give or take a day." - $8,888
3. **Yacht-Mess** - "For captains of group chats." - $12,345
4. **Dayfaker** - "Pretends to know what day it is." - $11,000
5. **Airbluff** - "High-flying looks, grounded accuracy." - $7,777
6. **Overexplorer** - "Pre-scuffed for that 'been places' vibe." - $10,101

## 🤖 AI Concierge Setup

To set up the ElevenLabs AI concierge:

1. Create an account at [ElevenLabs](https://elevenlabs.io)
2. Navigate to the Agent section
3. Create a new agent for luxury watch sales
4. Copy your Agent ID and API key
5. Add them to your environment variables

If the ElevenLabs domains are blocked in your environment, a local fallback script will be used instead. It simply shows a placeholder widget in place of the real voice agent.

The AI agent will be embedded on the `/agent` page and can answer questions about the watches, provide recommendations, and maintain the satirical tone of the brand.

## 🎨 Design Philosophy

- **Color Palette**: Off-white (#faf7f2) with gold accents (#d4af37)
- **Typography**: Playfair Display for headings, Inter for body text
- **Animations**: Subtle hover effects and micro-interactions
- **Humor**: Satirical copy that maintains luxury aesthetics

## 📱 Pages

- **/** - Main storefront with product grid
- **/agent** - AI concierge chat interface

## 🚫 Disclaimer

This is a parody project for demonstration purposes. No actual watches are sold, no payments are processed, and time accuracy is not guaranteed. Side effects may include sudden urges to check your phone for the actual time.

## 📄 License

© 2025 Brolex — All rights reversed.
*Batteries not included, actual time may vary.*

---

**Warning**: Punctuality not guaranteed. This project is intended for entertainment and educational purposes only.