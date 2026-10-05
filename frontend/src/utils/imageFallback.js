const DEFAULT_IMAGES = {
    shop: 'https://via.placeholder.com/400x300/FF6B81/FFFFFF?text=🏪',
    product: 'https://via.placeholder.com/300x300/FF4757/FFFFFF?text=🍔',
    avatar: 'https://via.placeholder.com/100x100/667eea/FFFFFF?text=👤',
    banner: 'https://via.placeholder.com/800x400/764ba2/FFFFFF?text=🎉',
    empty: 'https://via.placeholder.com/200x200/cccccc/999999?text=暂无图片'
}

export function handleImageError(event, type = 'product') {
    event.target.src = DEFAULT_IMAGES[type] || DEFAULT_IMAGES.product
    event.target.onerror = null
}

export function getImageUrl(url, type = 'product') {
    if (!url || url === 'null' || url === 'undefined') {
        return DEFAULT_IMAGES[type] || DEFAULT_IMAGES.product
    }
    return url
}
