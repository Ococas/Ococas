import React, { useState, useEffect } from "react";
import {
  Wine,
  UtensilsCrossed,
  Home,
  Clock,
  MapPin,
  Phone,
  Instagram,
  Menu,
  X,
  Star,
  Calendar,
  Mail,
  Facebook,
  Bus,
  Train,
  Send,
  Users,
  MessageCircle,
  ChevronDown,
  Wifi,
  Umbrella,
  Euro,
  CreditCard,
} from "lucide-react";
import { useTranslation } from "./hooks/useTranslation";
import { LanguageToggle } from "./components/LanguageToggle";
import { SectionTitle } from "./components/SectionTitle";
import { AnimatedSection } from "./components/AnimatedSection";
import { motion } from "framer-motion";
import { useRestaurantStatus } from "./hooks/useRestaurantStatus";
import client from "./Lib/sanityClient";

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, language, toggleLanguage } = useTranslation();
  const isOpen = useRestaurantStatus();
  const [imageUrl, setImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [contact, setContact] = useState({ phone: "", email: "" });
  const [formStatus, setFormStatus] = useState("");
  const [resultMessage, setResultMessage] = useState("");
  const [heroData, setHeroData] = useState(null);
  const [siteSettings, setSiteSettings] = useState(null);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "nossaCasaHistorica"][0]{
          image {
            asset -> {
              url
            }
          }
        }`
      )
      .then((result) => setImageUrl(result?.image?.asset?.url))
      .catch(console.error);
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "menuPdf"][0]{
          menuFile {
            asset -> {
              url
            }
          }
        }`
      )
      .then((result) => setPdfUrl(result?.menuFile?.asset?.url))
      .catch(console.error);
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "galerie"][0]{
          title,
          photos[]{
            asset -> {
              url
            },
            alt
          }
        }`
      )
      .then((data) => {
        setGallery(data?.photos || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "contactInfo"][0]{
          phone,
          email
        }`
      )
      .then((data) => setContact(data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "hero"][0]{
          title,
          subtitle,
          image {
            asset -> {
              url
            }
          }
        }`
      )
      .then((data) => setHeroData(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormStatus("loading");

    const formData = new FormData(event.target);
    formData.append("access_key", "99cd0362-2ced-4bdf-a126-45992d62a6fc");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormStatus("success");
        setResultMessage(t("contact.form.success"));
        event.target.reset();
      } else {
        setFormStatus("error");
        setResultMessage(data.message || t("contact.form.error"));
      }
    } catch (error) {
      console.error("Erreur d'envoi : ", error);
      setFormStatus("error");
      setResultMessage(t("contact.form.error"));
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    client
      .fetch(
        `*[_type == "siteSettings"][0]{
          openingHours,
          socialLinks
        }`
      )
      .then((data) => setSiteSettings(data))
      .catch(console.error);
  }, []);

  const currentLang =
    language === "en"
      ? "english"
      : language === "pt"
      ? "portuguese"
      : "english";
  const openingHours =
    siteSettings?.openingHours?.[currentLang] || "Horaires non disponibles";

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-stone-900/80 backdrop-blur-sm" : "bg-stone-900"
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <a href="#" className="flex items-center">
              <img
                src="https://lh3.googleusercontent.com/pw/AP1GczNcZ_GtpUPPc15gyRvXQFoPGekd_QubBDLjxP0LjU_6KRpfzwTTh_fQID5FuiY52O6g9bwYBRAnH_PMXRxayXMnd3bB6evc8ts0Rf9xpuw0zaPt258g6MoTHXGKurFjVH6nvunDt7DRBOFq2tz7VZh5=w861-h290-s-no-gm?authuser=0"
                alt="O Cocas Logo"
                className="h-12 w-auto"
              />
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a
                href="#menu"
                className="text-white hover:text-red-400 transition-colors"
              >
                {t("nav.about")}
              </a>
              <a
                href="#about"
                className="text-white hover:text-red-400 transition-colors"
              >
                {t("nav.menu")}
              </a>
              <a
                href="#reviews"
                className="text-white hover:text-red-400 transition-colors"
              >
                {t("nav.reviews")}
              </a>
              <a
                href="#contact"
                className="text-white hover:text-red-400 transition-colors"
              >
                {t("nav.contact")}
              </a>
              <a
                href="#contact"
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                {t("nav.reserve")}
              </a>
              <LanguageToggle language={language} onToggle={toggleLanguage} />
            </div>

            {/* Mobile Menu Controls */}
            <div className="md:hidden flex items-center gap-4">
              <LanguageToggle language={language} onToggle={toggleLanguage} />
              <button
                className="text-white p-2"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isMenuOpen ? "auto" : 0 }}
          className="md:hidden overflow-hidden bg-stone-900"
        >
          <div className="px-4 py-4 space-y-4">
            <a
              href="#menu"
              className="block text-white hover:text-red-400 transition-colors"
            >
              {t("nav.about")}
            </a>
            <a
              href="#about"
              className="block text-white hover:text-red-400 transition-colors"
            >
              {t("nav.menu")}
            </a>
            <a
              href="#reviews"
              className="block text-white hover:text-red-400 transition-colors"
            >
              {t("nav.reviews")}
            </a>
            <a
              href="#contact"
              className="block text-white hover:text-red-400 transition-colors"
            >
              {t("nav.contact")}
            </a>
            <a
              href="#contact"
              className="block w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              {t("nav.reserve")}
            </a>
          </div>
        </motion.div>
      </nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="h-screen relative bg-cover bg-center pt-28"
        style={{
          backgroundImage: `url(${heroData?.image?.asset?.url})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-stone-900/70 to-stone-900/30" />
        <div className="relative max-w-6xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center text-white">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-serif mb-4"
          >
            O Cocas
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl mb-8"
          >
            {t("hero.subtitle")}
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col items-center gap-4"
          >
            <a
              href="#contact"
              className="px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-lg"
            >
              {t("hero.cta")}
            </a>
            <div className={`text-sm font-medium text-green-400`}>
              {t("hero.open")}
              <span className="text-white/80 ml-2">{t("hero.closesAt")}</span>
            </div>
          </motion.div>

          {/* Bouncing Arrows */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            onClick={() => alert("Scrolling...")}
          >
            <ChevronDown className="w-8 h-8 text-white" />
            <ChevronDown className="w-8 h-8 text-white -mt-6" />
          </motion.div>
        </div>
      </motion.div>

      {/* Menu Section */}
      <section id="menu" className="py-20 px-4 bg-stone-100 relative">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionTitle
              title={t("menu.title")}
              icon={<UtensilsCrossed className="w-6 h-6 text-red-600" />}
            />
          </AnimatedSection>

          {/* Amenities Banner */}
          <AnimatedSection delay={0.1}>
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-sm mb-8 flex flex-col md:flex-row justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-red-600" />
                <span>{t("contact.info.amenities.wifi")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Umbrella className="w-5 h-5 text-red-600" />
                <span>{t("contact.info.amenities.outdoor")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Euro className="w-5 h-5 text-red-600" />
                <span>{t("contact.info.payment.cash")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-red-600" />
                <span>{t("contact.info.payment.card")}</span>
              </div>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                <h3 className="text-2xl font-serif mb-4">
                  {t("menu.wine.title")}
                </h3>
                <p className="text-gray-700 flex-grow">
                  {t("menu.wine.description")}
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                <h3 className="text-2xl font-serif mb-4">
                  {t("menu.tapas.title")}
                </h3>
                <p className="text-gray-700 flex-grow">
                  {t("menu.tapas.description")}
                </p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.6}>
              <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
                <h3 className="text-2xl font-serif mb-4">
                  {t("menu.main.title")}
                </h3>
                <p className="text-gray-700 flex-grow">
                  {t("menu.main.description")}
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-stone-50/50" />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection>
            <SectionTitle
              title={t("about.title")}
              icon={<Home className="w-6 h-6 text-red-600" />}
            />
          </AnimatedSection>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection delay={0.2}>
              <div>
                <img
                  src={imageUrl}
                  alt="Nossa Casa Histórica"
                  className="rounded-lg shadow-xl"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="space-y-6">
                <p className="text-lg text-gray-700">{t("about.text1")}</p>
                <p className="text-lg text-gray-700">{t("about.text2")}</p>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="flex items-center gap-2">
                    <Euro className="w-5 h-5 text-red-600" />
                    <span>{t("contact.info.payment.cash")}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-red-600" />
                    <span>{t("contact.info.payment.card")}</span>
                  </div>
                </div>
                <button
                  className="mt-6 px-8 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  {t("nav.menu")}
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-lg shadow-lg md:w-[60%] w-full mx-4">
              {/* Header de la modal */}
              <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Contenu de la modal */}
              <div className="p-4 h-full">
                {pdfUrl ? (
                  <iframe
                    src={pdfUrl}
                    title="Menu PDF"
                    className="w-full h-[40rem] border rounded-md"
                  ></iframe>
                ) : (
                  <p className="text-center text-gray-600">
                    {t("nav.menuLoading")}
                  </p>
                )}
              </div>

              {/* Footer de la modal */}
              <div className="flex justify-end p-4 border-t">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionTitle title={t("gallery.title")} />
            <p className="text-center text-gray-600 mb-12">
              {t("gallery.subtitle")}
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gallery.map((photo, index) => (
              <AnimatedSection key={index} delay={index * 0.2}>
                <div className="relative overflow-hidden rounded-lg aspect-square">
                  <img
                    src={photo.asset.url}
                    alt={photo.alt || "Gallery image"}
                    className="object-cover w-full h-full hover:scale-110 transition-transform duration-500"
                  />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-stone-50/50" />
        <div className="max-w-6xl mx-auto relative">
          <AnimatedSection>
            <SectionTitle
              title={t("reviews.title")}
              icon={<MessageCircle className="w-6 h-6 text-red-600" />}
            />
          </AnimatedSection>
          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-8 rounded-lg shadow-md h-full flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 flex-grow">
                  {t("reviews.review1.text")}
                </p>
                <p className="font-semibold">{t("reviews.review1.author")}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.4}>
              <div className="bg-white p-8 rounded-lg shadow-md h-full flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 flex-grow">
                  {t("reviews.review2.text")}
                </p>
                <p className="font-semibold">{t("reviews.review2.author")}</p>
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.6}>
              <div className="bg-white p-8 rounded-lg shadow-md h-full flex flex-col">
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 flex-grow">
                  {t("reviews.review3.text")}
                </p>
                <p className="font-semibold">{t("reviews.review3.author")}</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-stone-100">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <SectionTitle
              title={t("contact.title")}
              icon={<MapPin className="w-6 h-6 text-red-600" />}
            />
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact Information */}
            <AnimatedSection delay={0.2}>
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="text-2xl font-serif mb-6">
                  {t("contact.info.title")}
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">
                        {t("contact.info.address")}
                      </h4>
                      <p>R. dos Correeiros 177</p>
                      <p>1100-571 Lisboa, Portugal</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Clock className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">
                        {t("contact.info.schedule")}
                      </h4>
                      <p>{openingHours}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">
                        {t("contact.info.phone")}
                      </h4>
                      <p>{contact.phone || t("contact.info.loading")}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-red-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium mb-1">
                        {t("contact.info.email")}
                      </h4>
                      <p>{contact.email || t("contact.info.loading")}</p>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">
                      {t("contact.info.transport.title")}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Train className="w-5 h-5 text-red-600" />
                        <span>{t("contact.info.transport.metro")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bus className="w-5 h-5 text-red-600" />
                        <span>{t("contact.info.transport.bus")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">
                      {t("contact.info.amenities.title")}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-5 h-5 text-red-600" />
                        <span>{t("contact.info.amenities.wifi")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Umbrella className="w-5 h-5 text-red-600" />
                        <span>{t("contact.info.amenities.outdoor")}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h4 className="font-medium mb-3">
                      {t("contact.info.payment.title")}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Euro className="w-5 h-5 text-red-600" />
                        <span>{t("contact.info.payment.cash")}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-red-600" />
                        <span>{t("contact.info.payment.card")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Contact Form */}
            <AnimatedSection delay={0.4}>
              <div className="bg-white p-8 rounded-lg shadow-md" id="contact">
                <h3 className="text-2xl font-serif mb-2">
                  {t("contact.form.title")}
                </h3>
                <p className="text-gray-600 mb-6">
                  {t("contact.form.subtitle")}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nom et Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.form.name")}
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder={t("contact.form.namePlaceholder")}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.form.email")}
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder={t("contact.form.emailPlaceholder")}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                        required
                      />
                    </div>
                  </div>

                  {/* Téléphone et Nombre d'invités */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.form.phone")}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder={t("contact.form.phonePlaceholder")}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.form.guests")}
                      </label>
                      <input
                        type="number"
                        name="guests"
                        min="1"
                        placeholder={t("contact.form.guestsPlaceholder")}
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      />
                    </div>
                  </div>

                  {/* Date et Type */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.form.date")}
                      </label>
                      <input
                        type="date"
                        name="date"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.form.type")}
                      </label>
                      <select
                        name="type"
                        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {t("contact.form.typePlaceholder")}
                        </option>
                        <option value="group">
                          {t("contact.form.types.group")}
                        </option>
                        <option value="corporate">
                          {t("contact.form.types.corporate")}
                        </option>
                        <option value="celebration">
                          {t("contact.form.types.celebration")}
                        </option>
                        <option value="other">
                          {t("contact.form.types.other")}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t("contact.form.message")}
                    </label>
                    <textarea
                      name="message"
                      rows={4}
                      placeholder={t("contact.form.messagePlaceholder")}
                      className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-600 focus:border-red-600"
                      required
                    ></textarea>
                  </div>

                  {/* Bouton et état du formulaire */}
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      {t("contact.form.submit")}
                    </button>

                    {formStatus === "loading" && (
                      <p className="text-gray-600">
                        {t("contact.form.sending")}
                      </p>
                    )}
                    {formStatus === "success" && (
                      <p className="text-green-600">{resultMessage}</p>
                    )}
                    {formStatus === "error" && (
                      <p className="text-red-600">{resultMessage}</p>
                    )}
                  </div>
                </form>
              </div>
            </AnimatedSection>
          </div>

          {/* Map */}
          <AnimatedSection delay={0.6}>
            <div className="h-[400px] bg-white rounded-lg shadow-md overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3113.5754734271406!2d-9.1397!3d38.7116!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd1934796f85e061%3A0x4a0b0c14f14d407!2sR.%20dos%20Correeiros%20177%2C%201100-571%20Lisboa%2C%20Portugal!5e0!3m2!1sen!2s!4v1647095757000!5m2!1sen!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Logo et Description */}
            <div className="col-span-2">
              <img
                src="https://lh3.googleusercontent.com/pw/AP1GczNcZ_GtpUPPc15gyRvXQFoPGekd_QubBDLjxP0LjU_6KRpfzwTTh_fQID5FuiY52O6g9bwYBRAnH_PMXRxayXMnd3bB6evc8ts0Rf9xpuw0zaPt258g6MoTHXGKurFjVH6nvunDt7DRBOFq2tz7VZh5=w861-h290-s-no-gm?authuser=0"
                alt="O Cocas Logo"
                className="h-12 w-auto mb-4"
              />
              <p className="text-gray-400">{t("footer.about")}</p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-serif mb-4">
                {t("footer.quickLinks")}
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#menu"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {t("nav.menu")}
                  </a>
                </li>
                <li>
                  <a
                    href="#about"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {t("footer.aboutUs")}
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    {t("footer.contact")}
                  </a>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div>
              <h4 className="text-lg font-serif mb-4">
                {t("footer.followUs")}
              </h4>
              <div className="flex space-x-4">
                {siteSettings?.socialLinks?.facebook && (
                  <a
                    href={siteSettings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
                {siteSettings?.socialLinks?.instagram && (
                  <a
                    href={siteSettings.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
            <p>
              <a href="http://gosite-web.com" target="_blank">
                {t("footer.rights")}
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
