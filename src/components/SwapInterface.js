"use client"

import React, { useState, useEffect, useRef } from 'react'
import { ChevronDown, Settings, Search, X, MoreHorizontal, ArrowUpDown, Menu } from 'lucide-react'
import Image from 'next/image'
import logoImage from '../app/assets/logo.png'

const tokens = [
  { symbol: 'SMR', name: 'Shimmer', logo: 'https://raw.githubusercontent.com/TangleSwap/assets/main/chains/shimmer/tokens/0x1074010000000000000000000000000000000000/logo.png' },
  { symbol: 'USDT', name: 'Tether USD', logo: 'https://cryptologos.cc/logos/tether-usdt-logo.png' },
  { symbol: 'USDC', name: 'USD Coin', logo: 'https://cryptologos.cc/logos/usd-coin-usdc-logo.png' },
  { symbol: 'ETH', name: 'Ether', logo: 'https://cryptologos.cc/logos/ethereum-eth-logo.png' },
  { symbol: 'BTC', name: 'Wrapped Bitcoin', logo: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png' },
  { symbol: 'sIOTA', name: 'Wrapped IOTA', logo: 'https://cryptologos.cc/logos/iota-miota-logo.png' },
  { symbol: 'VOID', name: 'TangleSwap', logo: 'https://app.tangleswap.exchange/logo.png' },
]

const MetaMaskPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-[#1a1a1a] rounded-3xl p-6 w-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Connect Wallet</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X className="w-6 h-6" />
        </button>
      </div>
      <button className="w-full bg-[#1a1a1a] border-2 border-[#f6851b] rounded-full py-3 px-4 flex items-center justify-center hover:bg-[#2a2a2a] transition duration-300">
        <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-8 h-8 mr-3" />
        <span className="text-white text-xl font-bold">MetaMask</span>
      </button>
    </div>
  </div>
)

const StarryBackground = () => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const setCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasSize()

    const stars = []

    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5
      })
    }

    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = 'white'
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fill()
        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })
      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      setCanvasSize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />
}

export default function SwapInterface() {
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [showMetaMaskPopup, setShowMetaMaskPopup] = useState(false)
  const [selectedInputToken, setSelectedInputToken] = useState(tokens[0])
  const [selectedOutputToken, setSelectedOutputToken] = useState(tokens[1])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeSelector, setActiveSelector] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const filteredTokens = tokens.filter(token => 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleTokenSelect = (token) => {
    if (activeSelector === 'input') {
      setSelectedInputToken(token)
    } else if (activeSelector === 'output') {
      setSelectedOutputToken(token)
    }
    setShowTokenModal(false)
  }

  const openTokenModal = (selector) => {
    setActiveSelector(selector)
    setShowTokenModal(true)
  }

  const handleSwitch = () => {
    setSelectedInputToken(selectedOutputToken)
    setSelectedOutputToken(selectedInputToken)
    setInputAmount(outputAmount)
    setOutputAmount(inputAmount)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      <StarryBackground />
      <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-black opacity-50 z-0"></div>
      <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-[200vw] h-[200vw] bg-blue-500 rounded-full filter blur-[100px] opacity-20 z-0"></div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <nav className="w-full flex justify-between items-center backdrop-blur-lg bg-gradient-to-b from-[rgba(209,209,209,0.15)] to-[rgba(102,102,102,0.05)] rounded-[18px] shadow-[0px_0.636953px_0.636953px_-0.9375px_rgba(0,0,0,0.11),0px_1.9316px_1.9316px_-1.875px_rgba(0,0,0,0.1),0px_5.10612px_5.10612px_-2.8125px_rgba(0,0,0,0.09),0px_16px_16px_-3.75px_rgba(0,0,0,0.04)] mt-8 mx-auto px-6 py-3 max-w-[1200px]">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <Image src={logoImage} alt="TangleSwap logo" width={48} height={48} className="rounded-full" />
            </a>
            <ul className="hidden md:flex items-center ml-10 space-x-4">
              {['Trade', 'Liquidity', 'Farm', 'Stake'].map((item) => (
                <li key={item}>
                  <a
                    href={`/${item.toLowerCase()}`}
                    className="font-['CabinetGrotesk_Bold'] text-lg text-white hover:text-[#d874fa] transition-colors duration-400"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center">
            <button
              className="hidden md:block bg-[#1c4ed8] hover:bg-white hover:text-[#740e95] text-white text-base font-medium rounded-full px-8 py-4 transition-colors duration-400"
              onClick={() => setShowMetaMaskPopup(true)}
            >
              Connect Wallet
            </button>
            <button
              className="md:hidden text-white"
              onClick={toggleMobileMenu}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
        
        {mobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="bg-[#1a1a1a] w-64 h-full p-4">
              <div className="flex justify-between items-center mb-6">
                <Image src={logoImage} alt="TangleSwap logo" width={32} height={32} className="rounded-full" />
                <button onClick={toggleMobileMenu}>
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>
              <ul className="space-y-4">
                {['Trade', 'Liquidity', 'Farm', 'Stake', 'Invest'].map((item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase()}`}
                      className="font-['CabinetGrotesk_Bold'] text-lg text-white hover:text-[#d874fa] transition-colors duration-400"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
              <button
                className="w-full bg-[#2e003d] hover:bg-white hover:text-[#740e95] text-white text-base font-medium rounded-full px-4 py-2 mt-6 transition-colors duration-400"
                onClick={() => {
                  setShowMetaMaskPopup(true)
                  setMobileMenuOpen(false)
                }}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
        
        <div className="flex-grow flex justify-center items-center pt-20">
          <div className="max-w-[620px] w-full bg-[#120d18] border border-[#d874fa] rounded-[40px] p-5 relative z-10">
            <div className="grid grid-cols-3 items-center mb-6">
              <div></div>
              <div className="flex justify-center items-center">
                <h4 className="text-2xl font-medium bg-gradient-to-t from-[#695c32] to-[#e1d9b2] text-transparent bg-clip-text">Swap</h4>
              </div>
              <div className="flex justify-end">
                <Settings className="w-6 h-6 text-white opacity-80 cursor-pointer" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="bg-[#222] rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    className="flex items-center bg-blue-700 text-white rounded-full px-4 py-2 text-lg hover:bg-blue-600 transition  duration-300"
                    onClick={() => openTokenModal('input')}
                  >
                    <img src={selectedInputToken.logo} alt={selectedInputToken.symbol} className="w-8 h-8 mr-3" />
                    {selectedInputToken.symbol}
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-400">Balance: --</span>
                </div>
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    placeholder="0.0"
                    value={inputAmount}
                    onChange={(e) => setInputAmount(e.target.value)}
                    className="bg-transparent text-right text-3xl font-bold w-full outline-none"
                  />
                </div>
              </div>
              
              <div className="relative">
                <button 
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-700 border border-blue-400 rounded-2xl p-3 hover:bg-blue-600 transition duration-300"
                  onClick={handleSwitch}
                >
                  <ArrowUpDown className="w-5 h-5 text-white" />
                </button>
              </div>
              
              <div className="bg-[#222] rounded-3xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <button 
                    className="flex items-center bg-blue-700 text-white rounded-full px-4 py-2 text-lg hover:bg-blue-600 transition duration-300"
                    onClick={() => openTokenModal('output')}
                  >
                    <img src={selectedOutputToken.logo} alt={selectedOutputToken.symbol} className="w-8 h-8 mr-3" />
                    {selectedOutputToken.symbol}
                    <ChevronDown className="ml-2 w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-400">Balance: --</span>
                </div>
                <div className="flex justify-between items-center">
                  <input
                    type="text"
                    placeholder="0.0"
                    value={outputAmount}
                    onChange={(e) => setOutputAmount(e.target.value)}
                    className="bg-transparent text-right text-3xl font-bold w-full outline-none"
                  />
                </div>
              </div>
            </div>
            
            <button 
              className="w-full bg-blue-700 hover:bg-blue-600 text-white text-xl font-medium rounded-3xl py-6 mt-8 transition duration-300"
              onClick={() => setShowMetaMaskPopup(true)}
            >
              Connect Wallet
            </button>
          </div>
        </div>
      </div>

      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] rounded-3xl p-6 w-[400px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Select Token</h2>
              <button onClick={() => setShowTokenModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search token name or paste contract address"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2a2a2a] text-white rounded-full py-3 px-4 pl-10 outline-none"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {tokens.slice(0, 6).map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-full px-3 py-1"
                >
                  <img src={token.logo} alt={token.symbol} className="w-6 h-6 mr-2" />
                  <span>{token.symbol}</span>
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredTokens.map((token) => (
                <button
                  key={token.symbol}
                  onClick={() => handleTokenSelect(token)}
                  className="flex items-center justify-between w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded-xl p-3 transition duration-200"
                >
                  <div className="flex items-center">
                    <img src={token.logo} alt={token.symbol} className="w-8 h-8 mr-3" />
                    <div className="text-left">
                      <div className="font-bold">{token.symbol}</div>
                      <div className="text-sm text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">0</div>
                    <div className="text-sm text-gray-400">≈ $0.00</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showMetaMaskPopup && <MetaMaskPopup onClose={() => setShowMetaMaskPopup(false)} />}
    </div>
  )
}