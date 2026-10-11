/**
 * local-business.mjs — 本地商家结构化数据
 * ---------------------------------------------------------------------------
 * 旅游/本地搜索场景下，LocalBusiness 能显著提升「附近滤清器供应商」类
 * 查询的展现机会。这里独立成文件，便于 contact 页与首页复用。
 */
import siteConfig from '../../site.config.mjs'
import { abs } from './seo.mjs'

const ORIGIN = siteConfig.url.replace(/\/+$/, '')

export function localPageJsonLd(lang = 'zh') {
  const isEn = lang === 'en'
  const c = siteConfig.contact

  return {
    '@context': 'https://schema.org',
    '@type': 'AutoPartsStore',
    '@id': `${ORIGIN}/#localbusiness`,
    name: isEn ? siteConfig.brand.legalNameEn : siteConfig.brand.legalNameZh,
    image: abs('/brand/og-default.jpg'),
    url: abs(isEn ? '/en/contact/' : '/contact/'),
    telephone: c.salesPhone,
    email: c.email,
    priceRange: '¥¥',
    currenciesAccepted: 'CNY, USD',
    paymentAccepted: isEn ? 'Bank transfer, Alipay, WeChat Pay' : '银行转账、支付宝、微信支付',
    address: {
      '@type': 'PostalAddress',
      streetAddress: isEn ? c.addressEn : c.addressZh,
      addressLocality: isEn ? 'Dongguan' : '东莞市',
      addressRegion: isEn ? 'Guangdong' : '广东省',
      addressCountry: 'CN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: c.geo.lat,
      longitude: c.geo.lng,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '08:30',
        closes: '18:00',
      },
    ],
    areaServed: { '@type': 'Place', name: isEn ? 'Worldwide' : '全球' },
    parentOrganization: { '@id': `${ORIGIN}/#organization` },
  }
}
