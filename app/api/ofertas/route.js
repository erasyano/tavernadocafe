// Busca jogos gratuitos populares da Steam
async function fetchSteamFreeGames() {
  try {
    const res = await fetch('https://store.steampowered.com/api/featuredcategories?cc=br')
    const data = await res.json()
    if (!data || !data['freeweekend'] || !data['freeweekend'].items) return []
    return data['freeweekend'].items.map(game => ({
      id: `steam-free-${game.id}`,
      title: game.name,
      platform: 'Steam',
      price: 'Grátis',
      oldPrice: '',
      discount: 100,
      image: game.header_image,
      url: `https://store.steampowered.com/app/${game.id}`
    }))
  } catch {
    return []
  }
}

// Busca jogos gratuitos da Epic Games (Free Games Week)
async function fetchEpicFreeGames() {
  try {
    const res = await fetch('https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=pt-BR&country=BR&allowCountries=BR')
    const data = await res.json()
    if (!data || !data.data || !data.data.Catalog || !data.data.Catalog.searchStore || !data.data.Catalog.searchStore.elements) return []
    return data.data.Catalog.searchStore.elements
      .filter(game => game.price && game.price.totalPrice && game.price.totalPrice.discountPrice === 0)
      .map(game => ({
        id: `epic-free-${game.id}`,
        title: game.title,
        platform: 'Epic Games',
        price: 'Grátis',
        oldPrice: '',
        discount: 100,
        image: game.keyImages && game.keyImages.length > 0 ? game.keyImages[0].url : '',
        url: `https://store.epicgames.com/pt-BR/p/${game.productSlug}`
      }))
  } catch {
    return []
  }
}
// API route para buscar ofertas agregadas das lojas Steam, Epic, GOG e Itch.io
import { NextResponse } from 'next/server'


// Função para buscar a cotação do dólar para real (BRL)
async function fetchUSDtoBRL() {
  try {
    const res = await fetch('https://api.exchangerate.host/latest?base=USD&symbols=BRL')
    const data = await res.json()
    return data && data.rates && data.rates.BRL ? data.rates.BRL : 5.0
  } catch {
    return 5.0 // fallback
  }
}

// CheapShark: API pública de ofertas reais de Steam, GOG e Epic
async function fetchCheapSharkDeals() {
  try {
    // Busca jogos com desconto, ordenados por maior desconto
    const res = await fetch('https://www.cheapshark.com/api/1.0/deals?storeID=1,7,13&upperPrice=20&onSale=1&pageSize=30')
    const data = await res.json()
    if (!Array.isArray(data)) return []
    const usdToBrl = await fetchUSDtoBRL()
    return data.map(offer => {
      // Melhora imagem: tenta pegar imagem maior do Steam se possível
      let image = offer.thumb
      if (image && image.includes('capsule_sm_120')) {
        image = image.replace('capsule_sm_120', 'header')
      }
      // Converte preço para BRL
      const salePriceBRL = offer.salePrice ? (parseFloat(offer.salePrice) * usdToBrl).toFixed(2) : ''
      const normalPriceBRL = offer.normalPrice ? (parseFloat(offer.normalPrice) * usdToBrl).toFixed(2) : ''
      // Usa o nome da loja retornado pela CheapShark
      const platform = offer.storeName || 'Outro'
      return {
        id: offer.dealID,
        title: offer.title,
        platform,
        price: salePriceBRL ? `R$ ${salePriceBRL}` : '',
        oldPrice: normalPriceBRL ? `R$ ${normalPriceBRL}` : '',
        discount: offer.savings ? Math.round(parseFloat(offer.savings)) : 0,
        image,
        url: `https://www.cheapshark.com/redirect?dealID=${offer.dealID}`
      }
    })
  } catch {
    return []
  }
}

export async function GET() {
  const [cheapshark, steamFree, epicFree] = await Promise.all([
    fetchCheapSharkDeals(),
    fetchSteamFreeGames(),
    fetchEpicFreeGames()
  ])
  // Junta todas as ofertas, priorizando jogos gratuitos únicos
  const allOffers = [...epicFree, ...steamFree, ...cheapshark]
  // Remove duplicados por título+plataforma
  const seen = new Set()
  const offers = allOffers.filter(offer => {
    const key = offer.title + offer.platform
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
  return NextResponse.json({ offers })
}
