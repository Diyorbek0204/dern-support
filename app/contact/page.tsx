import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Phone, Mail, MapPin, Clock, Wrench, MessageCircle, CheckCircle, HelpCircle, Users } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">DernSupport</span>
          </Link>
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
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Biz bilan bog'laning</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Savollaringiz bormi? Yordam kerakmi? Bizning mutaxassislarimiz sizga yordam berishga doimo tayyor!
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mb-4">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Telefon</h3>
                    <p className="text-gray-700">+998 90 123 45 67</p>
                    <p className="text-gray-700">+998 91 234 56 78</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-purple-600 flex items-center justify-center mb-4">
                      <Mail className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Email</h3>
                    <p className="text-gray-700">info@dernsupport.uz</p>
                    <p className="text-gray-700">support@dernsupport.uz</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center mb-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Manzil</h3>
                    <p className="text-gray-700">
                      Toshkent shahar, Amir Temur ko'chasi 1-uy
                      <br />
                      100000, O'zbekiston
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-amber-600 flex items-center justify-center mb-4">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Ish Vaqti</h3>
                    <p className="text-gray-700">Dushanba - Juma: 9:00 - 18:00</p>
                    <p className="text-gray-700">Shanba: 9:00 - 15:00</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Emergency Contact */}
            <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
              <CardHeader>
                <CardTitle className="text-red-800 flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-red-600" />
                  Shoshilinch Yordam
                </CardTitle>
                <CardDescription className="text-red-600">24/7 shoshilinch qo'llab-quvvatlash uchun</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-red-800 text-lg">+998 90 999 99 99</span>
                </div>
              </CardContent>
            </Card>

            {/* Why Choose Us */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-blue-600" />
                Nima uchun bizni tanlashingiz kerak
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                  <span>Professional va tajribali mutaxassislar</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                  <span>Tez va sifatli xizmat</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                  <span>Qulay narxlar va shaffof narx siyosati</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-600 mt-0.5" />
                  <span>Barcha xizmatlar uchun kafolat</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="sticky top-24">
            <Card className="bg-white shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Xabar Yuborish
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Savolingizni yuboring, tez orada javob beramiz
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first_name">Ism</Label>
                      <Input id="first_name" placeholder="Ismingiz" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last_name">Familiya</Label>
                      <Input id="last_name" placeholder="Familiyangiz" required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="email@example.com" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input id="phone" placeholder="+998 90 123 45 67" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Mavzu</Label>
                    <Input id="subject" placeholder="Xabar mavzusi" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Xabar</Label>
                    <Textarea id="message" placeholder="Xabaringizni yozing..." className="min-h-[120px]" required />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    Xabar Yuborish
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <HelpCircle className="h-6 w-6 mr-2 text-blue-600" />
              Tez-tez So'raladigan Savollar
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Eng ko'p so'raladigan savollarga javoblar. Boshqa savollaringiz bo'lsa, bizga murojaat qiling.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Qancha vaqtda javob olaman?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Odatda 24 soat ichida javob beramiz. Shoshilinch holatlar uchun telefon orqali bog'laning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Xizmat narxi qancha?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Narx muammoning murakkabligiga qarab belgilanadi. Bepul konsultatsiya olish uchun bog'laning.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Uyga chiqib xizmat ko'rsatasizmi?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Ha, Toshkent shahar bo'ylab uyga chiqib xizmat ko'rsatamiz. Qo'shimcha to'lov talab qilinadi.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-gray-50 rounded-t-lg">
                <CardTitle className="text-lg flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-blue-600" />
                  Kafolat berasizmi?
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-gray-600">
                  Barcha ta'mirlash ishlari uchun 30 kunlik kafolat beramiz. Ehtiyot qismlar uchun alohida kafolat.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Users className="h-6 w-6 mr-2 text-blue-600" />
              Mijozlarimiz fikrlari
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Bizning xizmatlarimizdan foydalangan mijozlarimiz fikrlari
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-blue-100 border-2 border-blue-200 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-blue-600">AK</span>
                  </div>
                  <h3 className="font-semibold text-lg">Aziz Karimov</h3>
                  <p className="text-sm text-gray-500 mb-4">Toshkent</p>
                  <p className="text-gray-600 italic">
                    "Juda tez va sifatli xizmat ko'rsatishdi. Kompyuterim avvalgidan ham yaxshi ishlayapti. Rahmat!"
                  </p>
                  <div className="flex mt-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-purple-100 border-2 border-purple-200 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-purple-600">MN</span>
                  </div>
                  <h3 className="font-semibold text-lg">Malika Normatova</h3>
                  <p className="text-sm text-gray-500 mb-4">Samarqand</p>
                  <p className="text-gray-600 italic">
                    "Laptopim suv tushib ishlamay qolgan edi. DernSupport mutaxassislari uni to'liq tiklashdi. Juda ham
                    minnatdorman!"
                  </p>
                  <div className="flex mt-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-white">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-green-100 border-2 border-green-200 flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-green-600">JA</span>
                  </div>
                  <h3 className="font-semibold text-lg">Jamshid Alimov</h3>
                  <p className="text-sm text-gray-500 mb-4">Buxoro</p>
                  <p className="text-gray-600 italic">
                    "Ofisimizdagi barcha kompyuterlarni DernSupport xodimlari sozlab berishdi. Endi hech qanday muammo
                    yo'q. Tavsiya qilaman!"
                  </p>
                  <div className="flex mt-3">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="w-full h-96 bg-gray-200 mt-16">
        <div className="w-full h-full flex items-center justify-center bg-gray-300">
          <div className="text-center">
            <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-600">Xarita joylashuvi</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
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
                  <Link href="/about" className="hover:text-white transition-colors">
                    Biz haqimizda
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Bog'lanish
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-white transition-colors">
                    FAQ
                  </Link>
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
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>info@dernsupport.uz</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Toshkent, Amir Temur ko'chasi 1</span>
                </div>
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
