import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Clock, Users, Wrench, Shield, Phone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">DernSupport</h1>
          </div>
          <div className="flex space-x-4">
            <Button asChild variant="outline">
              <Link href="/login">Kirish</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Ro'yxatdan o'tish</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">Professional IT Support & Repair Services</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Kompyuter va IT qurilmalaringiz uchun professional ta'mirlash va qo'llab-quvvatlash xizmatlari. Tez,
            ishonchli va sifatli xizmat kafolati bilan.
          </p>
          <div className="flex justify-center space-x-4">
            <Button asChild size="lg" className="px-8">
              <Link href="/register">Hoziroq boshlash</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="px-8">
              <Link href="/contact">Bog'lanish</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Bizning Xizmatlarimiz</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <Wrench className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle>Hardware Ta'mirlash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Kompyuter va laptop ta'mirlash, komponentlar almashtirish</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <CardTitle>Software Yechimlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Dasturiy ta'minot o'rnatish, virus tozalash, tizim optimallashtirish</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-600 mx-auto mb-4" />
                <CardTitle>24/7 Qo'llab-quvvatlash</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Doimiy texnik yordam va maslahat xizmatlari</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                <CardTitle>Tez Xizmat</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Tezkor muammolarni hal qilish va ta'mirlash</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">Nima uchun bizni tanlash kerak?</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Professional Jamoa</h4>
                    <p className="text-gray-600">Tajribali va malakali mutaxassislar</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Sifat Kafolati</h4>
                    <p className="text-gray-600">Barcha ishlar uchun kafolat beramiz</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Tez Xizmat</h4>
                    <p className="text-gray-600">Minimal vaqtda maksimal natija</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold">Qulay Narxlar</h4>
                    <p className="text-gray-600">Raqobatbardosh va adolatli narxlar</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-lg">
              <h4 className="text-2xl font-bold mb-4">Onlayn Xizmat</h4>
              <p className="text-gray-700 mb-6">Bizning onlayn platformamiz orqali:</p>
              <ul className="space-y-2 text-gray-700">
                <li>• So'rov yuborish va kuzatish</li>
                <li>• Ish holatini real vaqtda ko'rish</li>
                <li>• Mutaxassislar bilan bog'lanish</li>
                <li>• Qulay to'lov usullari</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-blue-600 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Mamnun mijozlar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Bajarilgan ishlar</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Qo'llab-quvvatlash</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Muvaffaqiyat darajasi</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-3xl font-bold mb-6">Hoziroq boshlaymizmi?</h3>
          <p className="text-xl text-gray-600 mb-8">Ro'yxatdan o'ting va birinchi so'rovingizni yuboring</p>
          <Button asChild size="lg" className="px-8">
            <Link href="/register">Ro'yxatdan o'tish</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Wrench className="h-6 w-6" />
                <span className="text-xl font-bold">DernSupport</span>
              </div>
              <p className="text-gray-400">Professional IT xizmatlari va qo'llab-quvvatlash</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Xizmatlar</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Hardware ta'mirlash</li>
                <li>Software yechimlar</li>
                <li>Tarmoq sozlash</li>
                <li>Ma'lumotlarni tiklash</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kompaniya</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/about">Biz haqimizda</Link>
                </li>
                <li>
                  <Link href="/contact">Bog'lanish</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Bog'lanish</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span>+998 90 123 45 67</span>
                </div>
                <div>info@dernsupport.uz</div>
                <div>Toshkent, Amir Temur ko'chasi 1</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DernSupport. Barcha huquqlar himoyalangan.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
