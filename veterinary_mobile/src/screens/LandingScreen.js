import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
  Modal,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Curated Dark Palette matching Web SaaS Landing Page
const darkTheme = {
  bg: '#0b1329',          // Very dark slate blue
  cardBg: '#111c38',      // Elevated dark card background
  cardBorder: '#1e2d54',  // Dark subtle border
  primary: '#14b8a6',    // Neon Teal / Emerald accent
  primaryDark: '#0d9488',
  primaryLight: '#2dd4bf',
  textPrimary: '#ffffff',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  badgeBg: '#1e293b',
  gold: '#f59e0b',
  danger: '#ef4444',
  success: '#10b981',
};

export default function LandingScreen({ navigation }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [brochureModalOpen, setBrochureModalOpen] = useState(false);
  const scrollViewRef = useRef(null);

  // Layout Y positions for smooth scrolling to sections
  const sectionYPositions = useRef({
    home: 0,
    brochure: 0,
    features: 0,
    benefits: 0,
    testimonials: 0,
    pricing: 0,
    contact: 0,
  });

  const scrollToSection = (sectionKey) => {
    setDrawerOpen(false);
    if (sectionKey === 'brochure') {
      navigation.navigate('Brochure');
      return;
    }
    const yPos = sectionYPositions.current[sectionKey] || 0;
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: Math.max(0, yPos - 10), animated: true });
    }
  };

  const handleCall = () => {
    Linking.openURL('tel:+919752100980').catch(() => {
      Alert.alert('Contact Us', 'Call: +91 97521 00980');
    });
  };

  const handleEmail = () => {
    Linking.openURL('mailto:info@kiaantechnology.com').catch(() => {
      Alert.alert('Contact Us', 'Email: info@kiaantechnology.com');
    });
  };

  const handleOpenMap = () => {
    const query = encodeURIComponent('2341, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009');
    Linking.openURL(`https://maps.google.com/?q=${query}`).catch(() => {
      Alert.alert('Location', '2341, Sector E, Sudama Nagar, Indore, Madhya Pradesh 452009');
    });
  };

  const showInfoAlert = (title, message) => {
    Alert.alert(title, message);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={darkTheme.bg} />

      {/* 1. STICKY HEADER */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.brandLogoBox}
          onPress={() => scrollToSection('home')}
          activeOpacity={0.8}
        >
          <Image source={require('../../assets/icon.png')} style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8, resizeMode: 'contain' }} />
          <Text style={styles.brandTitle}>
            PetCare <Text style={{ color: darkTheme.primary }}>Pro</Text>
          </Text>
        </TouchableOpacity>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            style={styles.btnNavOutline}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.btnNavOutlineText}>Admin Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.btnNavPrimary}
            onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
          >
            <Text style={styles.btnNavPrimaryText}>Free Trial</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnMenuToggle}
            onPress={() => setDrawerOpen(true)}
          >
            <Ionicons name="menu-outline" size={26} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.scrollBody}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. HERO SECTION */}
        <View
          style={styles.heroSection}
          onLayout={(e) => {
            sectionYPositions.current.home = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.heroBadge}>
            <Ionicons name="trophy" size={14} color={darkTheme.gold} />
            <Text style={styles.heroBadgeText}>
              #1 Petcare Clinic Management Software
            </Text>
          </View>

          <Text style={styles.heroMainTitle}>
            Transform Your{'\n'}
            <Text style={styles.heroGradientText}>Petcare Practice</Text>
          </Text>

          <Text style={styles.heroSubText}>
            The all-in-one solution for modern petcare clinics and pet hospitals. Streamline appointments, manage pet records, automate billing, and grow your clinic.
          </Text>

          <View style={styles.heroActionsRow}>
            <TouchableOpacity
              style={styles.btnHeroPrimary}
              onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
              activeOpacity={0.85}
            >
              <Text style={styles.btnHeroPrimaryText}>Start 7-Day Free Trial</Text>
              <Ionicons name="arrow-forward" size={18} color="#ffffff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.btnHeroSecondary}
              onPress={() => scrollToSection('pricing')}
            >
              <Text style={styles.btnHeroSecondaryText}>View Pricing Plans</Text>
            </TouchableOpacity>
          </View>

          {/* Hero Doctor Image Card */}
          <View style={styles.heroImageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&w=1200&q=80',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
          </View>

          {/* Stats Bar Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>500+</Text>
              <Text style={styles.statLbl}>Happy Clinics</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>50K+</Text>
              <Text style={styles.statLbl}>Pets Treated</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>99.9%</Text>
              <Text style={styles.statLbl}>Uptime</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>24/7</Text>
              <Text style={styles.statLbl}>Support</Text>
            </View>
          </View>
        </View>

        {/* 3. FEATURES SECTION */}
        <View
          style={styles.sectionContainer}
          onLayout={(e) => {
            sectionYPositions.current.features = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.centerBadge}>
            <Ionicons name="flash" size={14} color={darkTheme.primary} />
            <Text style={darkThemeSectionBadgeText}>FEATURES</Text>
          </View>

          <Text style={styles.sectionHeaderTitle}>
            Everything You Need to <Text style={{ color: darkTheme.primary }}>Manage Your Clinic</Text>
          </Text>
          <Text style={styles.sectionHeaderSub}>
            Comprehensive tools designed specifically for petcare practices.
          </Text>

          <View style={styles.featuresList}>
            {/* Feature 1 */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <Ionicons name="calendar-outline" size={24} color={darkTheme.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Smart Appointments</Text>
              <Text style={styles.featureCardDesc}>
                Manage clinic appointments, home visits, vaccination schedules with automated reminders for pet owners.
              </Text>
              <TouchableOpacity style={styles.featLinkRow} onPress={() => scrollToSection('pricing')}>
                <Text style={styles.featLinkText}>Learn more</Text>
                <Ionicons name="chevron-forward" size={14} color={darkTheme.primary} />
              </TouchableOpacity>
            </View>

            {/* Feature 2 */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <MaterialCommunityIcons name="folder-heart-outline" size={24} color={darkTheme.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Pet Medical Records</Text>
              <Text style={styles.featureCardDesc}>
                Detailed health records, treatment history, vaccination logs with easy search and instant PDF exports.
              </Text>
              <TouchableOpacity style={styles.featLinkRow} onPress={() => scrollToSection('pricing')}>
                <Text style={styles.featLinkText}>Learn more</Text>
                <Ionicons name="chevron-forward" size={14} color={darkTheme.primary} />
              </TouchableOpacity>
            </View>

            {/* Feature 3 */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <Ionicons name="card-outline" size={24} color={darkTheme.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Billing & POS</Text>
              <Text style={styles.featureCardDesc}>
                Automated billing, multiple payment methods (UPI, Card, Cash), and GST-compliant receipts.
              </Text>
              <TouchableOpacity style={styles.featLinkRow} onPress={() => scrollToSection('pricing')}>
                <Text style={styles.featLinkText}>Learn more</Text>
                <Ionicons name="chevron-forward" size={14} color={darkTheme.primary} />
              </TouchableOpacity>
            </View>

            {/* Feature 4 */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <Ionicons name="bar-chart-outline" size={24} color={darkTheme.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Reports & Analytics</Text>
              <Text style={styles.featureCardDesc}>
                Revenue tracking, pet visit trends, staff performance metrics, and inventory consumption analytics.
              </Text>
              <TouchableOpacity style={styles.featLinkRow} onPress={() => scrollToSection('pricing')}>
                <Text style={styles.featLinkText}>Learn more</Text>
                <Ionicons name="chevron-forward" size={14} color={darkTheme.primary} />
              </TouchableOpacity>
            </View>

            {/* Feature 5 */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <Ionicons name="cube-outline" size={24} color={darkTheme.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Inventory Management</Text>
              <Text style={styles.featureCardDesc}>
                Stock control for medicines, vaccines, pet food with automated low-stock alerts and batch tracking.
              </Text>
              <TouchableOpacity style={styles.featLinkRow} onPress={() => scrollToSection('pricing')}>
                <Text style={styles.featLinkText}>Learn more</Text>
                <Ionicons name="chevron-forward" size={14} color={darkTheme.primary} />
              </TouchableOpacity>
            </View>

            {/* Feature 6 */}
            <View style={styles.featureCard}>
              <View style={styles.featureIconCircle}>
                <Ionicons name="notifications-outline" size={24} color={darkTheme.primary} />
              </View>
              <Text style={styles.featureCardTitle}>Email & SMS Reminders</Text>
              <Text style={styles.featureCardDesc}>
                Automated appointment reminders, vaccination due alerts, and follow-up notifications.
              </Text>
              <TouchableOpacity style={styles.featLinkRow} onPress={() => scrollToSection('pricing')}>
                <Text style={styles.featLinkText}>Learn more</Text>
                <Ionicons name="chevron-forward" size={14} color={darkTheme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 4. WHY CHOOSE US / BENEFITS */}
        <View
          style={styles.sectionContainer}
          onLayout={(e) => {
            sectionYPositions.current.benefits = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.leftBadge}>
            <Ionicons name="shield-checkmark" size={14} color={darkTheme.primary} />
            <Text style={darkThemeSectionBadgeText}>WHY CHOOSE US</Text>
          </View>

          <Text style={styles.leftSectionTitle}>
            Why <Text style={{ color: darkTheme.primary }}>PetCare Pro</Text> Stands Out
          </Text>

          <View style={styles.checklistContainer}>
            {[
              'Increase clinic efficiency by up to 40%',
              'Save 15+ hours per week on administrative tasks',
              'Reduce no-shows with automated reminders',
              'Boost revenue with streamlined billing and POS',
              'Enhance pet owner experience with digital records',
              'Make data-driven decisions with real-time analytics',
            ].map((text, idx) => (
              <View key={idx} style={styles.checkItem}>
                <Ionicons name="checkmark-circle" size={18} color={darkTheme.primary} />
                <Text style={styles.checkText}>{text}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.btnSeeBenefits}
            onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
          >
            <Text style={styles.btnSeeBenefitsText}>See All Benefits</Text>
            <Ionicons name="arrow-forward" size={16} color="#ffffff" />
          </TouchableOpacity>

          {/* Metrics Grid */}
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricVal}>40%</Text>
              <Text style={styles.metricLbl}>Faster Check-ins</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricVal}>15+</Text>
              <Text style={styles.metricLbl}>Hours Saved Weekly</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricVal}>99.9%</Text>
              <Text style={styles.metricLbl}>System Uptime</Text>
            </View>
          </View>

          {/* Quote Card */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteBody}>
              "PetCare Pro transformed how we run our clinic! Automated vaccination reminders and instant digital billing increased our repeat client visits by 40%."
            </Text>
            <View style={styles.quoteAuthorRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>RS</Text>
              </View>
              <View>
                <Text style={styles.authorName}>Dr. Rahul Sharma</Text>
                <Text style={styles.authorSub}>Owner, City Pet Clinic</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 5. TESTIMONIALS */}
        <View
          style={styles.sectionContainer}
          onLayout={(e) => {
            sectionYPositions.current.testimonials = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.centerBadge}>
            <Ionicons name="star" size={14} color={darkTheme.gold} />
            <Text style={darkThemeSectionBadgeText}>TESTIMONIALS</Text>
          </View>

          <Text style={styles.sectionHeaderTitle}>
            What Our <Text style={{ color: darkTheme.primary }}>Clients Say</Text>
          </Text>

          <View style={styles.testimonialsGrid}>
            {/* Card 1 */}
            <View style={styles.testimonialCard}>
              <View style={styles.testiUserRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#14b8a6' }]}>
                  <Text style={styles.avatarText}>AV</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>Dr. Aman Verma</Text>
                  <Text style={styles.authorSub}>Senior Vet, PetCare Hospital</Text>
                </View>
              </View>
              <Text style={styles.testiText}>
                "PetCare Pro has completely automated our clinic operations. Our team saves 20+ hours every week!"
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={16} color={darkTheme.gold} />
                ))}
              </View>
            </View>

            {/* Card 2 */}
            <View style={styles.testimonialCard}>
              <View style={styles.testiUserRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#0d9488' }]}>
                  <Text style={styles.avatarText}>NG</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>Dr. Neha Gupta</Text>
                  <Text style={styles.authorSub}>Owner, Paws & Claws Clinic</Text>
                </View>
              </View>
              <Text style={styles.testiText}>
                "Managing pet records, vaccination schedules, and billing has never been easier."
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={16} color={darkTheme.gold} />
                ))}
              </View>
            </View>

            {/* Card 3 */}
            <View style={styles.testimonialCard}>
              <View style={styles.testiUserRow}>
                <View style={[styles.avatarCircle, { backgroundColor: '#0284c7' }]}>
                  <Text style={styles.avatarText}>KV</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.authorName}>Karan Verma</Text>
                  <Text style={styles.authorSub}>Manager, Happy Tails Center</Text>
                </View>
              </View>
              <Text style={styles.testiText}>
                "The real-time WhatsApp & email notifications keep our pet owners informed. Highly recommended!"
              </Text>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Ionicons key={i} name="star" size={16} color={darkTheme.gold} />
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* 6. PRICING PLANS */}
        <View
          style={styles.sectionContainer}
          onLayout={(e) => {
            sectionYPositions.current.pricing = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.centerBadge}>
            <Ionicons name="card" size={14} color={darkTheme.primary} />
            <Text style={darkThemeSectionBadgeText}>PRICING PLANS</Text>
          </View>

          <Text style={styles.sectionHeaderTitle}>
            Choose Your <Text style={{ color: darkTheme.primary }}>Perfect Plan</Text>
          </Text>
          <Text style={styles.sectionHeaderSub}>
            Flexible options for clinics of all sizes.
          </Text>

          <View style={styles.pricingList}>
            {/* Plan 1: Free Trial */}
            <View style={styles.pricingCard}>
              <Text style={[styles.planTitle, { color: darkTheme.success }]}>Free Trial</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>₹0</Text>
                <Text style={styles.pricePeriod}>for 7 Days</Text>
              </View>
              <View style={styles.planChecklist}>
                <Text style={styles.planCheckItem}>✓ Full access for 7 days</Text>
                <Text style={styles.planCheckItem}>✓ No credit card required</Text>
                <Text style={styles.planCheckItem}>✓ Quick 2-minute setup</Text>
              </View>
              <TouchableOpacity
                style={styles.btnPlan}
                onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
              >
                <Text style={styles.btnPlanText}>Start Free Trial</Text>
              </TouchableOpacity>
            </View>

            {/* Plan 2: Starter */}
            <View style={styles.pricingCard}>
              <Text style={styles.planTitle}>Starter</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>₹599</Text>
                <Text style={styles.pricePeriod}>/ month</Text>
              </View>
              <View style={styles.planChecklist}>
                <Text style={styles.planCheckItem}>✓ Basic clinic management</Text>
                <Text style={styles.planCheckItem}>✓ Up to 100 pets</Text>
                <Text style={styles.planCheckItem}>✓ Email reminders</Text>
                <Text style={styles.planCheckItem}>✓ Standard support</Text>
              </View>
              <TouchableOpacity
                style={styles.btnPlan}
                onPress={() => navigation.navigate('Register', { plan: 'starter' })}
              >
                <Text style={styles.btnPlanText}>Get Started</Text>
              </TouchableOpacity>
            </View>

            {/* Plan 3: Standard (Featured) */}
            <View style={[styles.pricingCard, styles.pricingCardFeatured]}>
              <View style={styles.popularPill}>
                <Text style={styles.popularPillText}>MOST POPULAR</Text>
              </View>
              <Text style={[styles.planTitle, { color: darkTheme.primary }]}>Standard</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>₹799</Text>
                <Text style={styles.pricePeriod}>/ month</Text>
              </View>
              <View style={styles.planChecklist}>
                <Text style={styles.planCheckItem}>✓ Complete features for growing clinics</Text>
                <Text style={styles.planCheckItem}>✓ Up to 500 pets</Text>
                <Text style={styles.planCheckItem}>✓ WhatsApp + Email reminders</Text>
                <Text style={styles.planCheckItem}>✓ Priority support</Text>
              </View>
              <TouchableOpacity
                style={[styles.btnPlan, { backgroundColor: darkTheme.primary }]}
                onPress={() => navigation.navigate('Register', { plan: 'standard' })}
              >
                <Text style={styles.btnPlanText}>Get Started</Text>
              </TouchableOpacity>
            </View>

            {/* Plan 4: Pro */}
            <View style={styles.pricingCard}>
              <Text style={styles.planTitle}>Pro</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceAmount}>₹1,299</Text>
                <Text style={styles.pricePeriod}>/ month</Text>
              </View>
              <View style={styles.planChecklist}>
                <Text style={styles.planCheckItem}>✓ Advanced features</Text>
                <Text style={styles.planCheckItem}>✓ Unlimited pets</Text>
                <Text style={styles.planCheckItem}>✓ Multi-clinic support</Text>
                <Text style={styles.planCheckItem}>✓ Dedicated account manager</Text>
              </View>
              <TouchableOpacity
                style={styles.btnPlan}
                onPress={() => navigation.navigate('Register', { plan: 'pro' })}
              >
                <Text style={styles.btnPlanText}>Get Started</Text>
              </TouchableOpacity>
            </View>

            {/* Plan 5: Custom */}
            <View style={styles.pricingCard}>
              <View style={[styles.popularPill, { backgroundColor: '#7c3aed' }]}>
                <Text style={styles.popularPillText}>ENTERPRISE</Text>
              </View>
              <Text style={[styles.planTitle, { color: '#8b5cf6' }]}>Custom Plan</Text>
              <View style={styles.priceRow}>
                <Text style={[styles.priceAmount, { color: '#8b5cf6' }]}>Custom</Text>
                <Text style={styles.pricePeriod}> pricing</Text>
              </View>
              <Text style={{ fontSize: 13, color: darkTheme.textSecondary, marginBottom: 10 }}>
                Tailored to your clinic's specific needs.
              </Text>
              <View style={styles.planChecklist}>
                <Text style={styles.planCheckItem}>✓ SaaS with full customization</Text>
                <Text style={styles.planCheckItem}>✓ Personal domain & branding</Text>
                <Text style={styles.planCheckItem}>✓ 🤖 AI & automation features</Text>
                <Text style={styles.planCheckItem}>✓ Dedicated account manager</Text>
              </View>
              <TouchableOpacity
                style={[styles.btnPlan, { backgroundColor: '#7c3aed' }]}
                onPress={() => navigation.navigate('Register', { plan: 'custom' })}
              >
                <Text style={styles.btnPlanText}>Get Started</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* 7. BOTTOM CTA BANNER */}
        <View style={styles.ctaBanner}>
          <Text style={styles.ctaTitle}>Ready to Transform Your Clinic?</Text>
          <Text style={styles.ctaSub}>
            Join thousands of pet practitioners who have already streamlined their practice.
          </Text>
          <TouchableOpacity
            style={styles.btnCtaLg}
            onPress={() => navigation.navigate('Register', { plan: 'free-trial' })}
          >
            <Text style={styles.btnCtaLgText}>Start Free Trial</Text>
            <Ionicons name="arrow-forward" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* 8. FOOTER */}
        <View
          style={styles.footerContainer}
          onLayout={(e) => {
            sectionYPositions.current.contact = e.nativeEvent.layout.y;
          }}
        >
          <View style={styles.footerBrandRow}>
            <MaterialCommunityIcons name="stethoscope" size={24} color={darkTheme.primary} />
            <Text style={styles.footerBrandText}>
              KIAAN <Text style={{ color: darkTheme.primary }}>TECHNOLOGY</Text>
            </Text>
          </View>

          <Text style={styles.footerDescText}>
            The ultimate management solution for modern petcare clinics, pet hospitals, and animal care centers.
          </Text>

          {/* Quick Links Section */}
          <Text style={styles.footerSecTitle}>QUICK NAVIGATION</Text>
          <View style={styles.footerQuickNavRow}>
            {['home', 'features', 'benefits', 'testimonials', 'pricing', 'contact'].map((sec) => (
              <TouchableOpacity
                key={sec}
                style={styles.quickNavChip}
                onPress={() => scrollToSection(sec)}
              >
                <Text style={styles.quickNavChipText}>
                  {sec.charAt(0).toUpperCase() + sec.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Contact Details Interactive Buttons */}
          <Text style={styles.footerSecTitle}>CONTACT US</Text>
          <View style={styles.contactItemsBox}>
            <TouchableOpacity style={styles.contactItemRow} onPress={handleOpenMap}>
              <Ionicons name="location-outline" size={18} color={darkTheme.primary} />
              <Text style={styles.contactItemText}>
                2341, Sector E, Sudama Nagar, Indore, MP 452009
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItemRow} onPress={handleCall}>
              <Ionicons name="call-outline" size={18} color={darkTheme.primary} />
              <Text style={styles.contactItemText}>+91 97521 00980 (Tap to Call)</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItemRow} onPress={handleEmail}>
              <Ionicons name="mail-outline" size={18} color={darkTheme.primary} />
              <Text style={styles.contactItemText}>info@kiaantechnology.com (Tap to Email)</Text>
            </TouchableOpacity>
          </View>

          {/* Social Links Row */}
          <View style={styles.socialRow}>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#c13584' }]} onPress={() => Linking.openURL('https://www.instagram.com/kiaan_technology4/')}>
              <Ionicons name="logo-instagram" size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#1877f2' }]} onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61560965313920&mibextid=ZbWKwL')}>
              <Ionicons name="logo-facebook" size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#0a66c2' }]} onPress={() => Linking.openURL('https://www.linkedin.com/company/kiaan-technology-pvt-ltd/posts/?feedView=all')}>
              <Ionicons name="logo-linkedin" size={18} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialIcon, { backgroundColor: '#14b8a6' }]} onPress={() => Linking.openURL('https://kiaantechnology.com/')}>
              <Ionicons name="globe-outline" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          {/* Bottom Policy Links */}
          <View style={styles.footerBottomLinks}>
            <TouchableOpacity onPress={() => showInfoAlert('Privacy Policy', 'PetCare Pro protects clinic & patient health data with enterprise grade 256-bit encryption.')}>
              <Text style={styles.footerBottomLinkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <Text style={{ color: darkTheme.cardBorder }}>|</Text>
            <TouchableOpacity onPress={() => showInfoAlert('Terms of Service', 'Standard SaaS subscription terms apply. Cancel anytime during free trial with zero charges.')}>
              <Text style={styles.footerBottomLinkText}>Terms & Conditions</Text>
            </TouchableOpacity>
            <Text style={{ color: darkTheme.cardBorder }}>|</Text>
            <TouchableOpacity onPress={() => showInfoAlert('Documentation', 'Documentation & User Guide is available inside the application dashboard.')}>
              <Text style={styles.footerBottomLinkText}>Docs</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerCopy}>
            © 2026 Kiaan Tech Craft. All rights reserved. Powered by Kiaan Technology.
          </Text>
        </View>
      </ScrollView>

      {/* Floating WhatsApp Button */}
      <TouchableOpacity
        style={styles.whatsappFloat}
        onPress={() => Linking.openURL('https://wa.me/919752100980?text=Hello%20Kiaan%20Technology%2C%20I%20would%20like%20to%20know%20more%20about%20your%20PetCare%20Pro%20SaaS%20solution.')}
        activeOpacity={0.85}
      >
        <Ionicons name="logo-whatsapp" size={30} color="#ffffff" />
      </TouchableOpacity>

      {/* MOBILE NAVIGATION DRAWER MODAL */}
      <Modal visible={drawerOpen} transparent animationType="slide">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setDrawerOpen(false)}
        >
          <View style={styles.drawerContent} onStartShouldSetResponder={() => true}>
            <View style={styles.drawerHeader}>
              <View style={styles.brandLogoBox}>
                <Image source={require('../../assets/icon.png')} style={{ width: 32, height: 32, borderRadius: 8, marginRight: 8, resizeMode: 'contain' }} />
                <Text style={styles.brandTitle}>
                  PetCare <Text style={{ color: darkTheme.primary }}>Pro</Text>
                </Text>
              </View>
              <TouchableOpacity onPress={() => setDrawerOpen(false)}>
                <Ionicons name="close" size={26} color="#ffffff" />
              </TouchableOpacity>
            </View>

            <View style={styles.drawerLinksList}>
              {[
                { label: 'Home', section: 'home', icon: 'home-outline' },
                { label: 'All-In-One Brochure', section: 'brochure', icon: 'document-text-outline' },
                { label: 'Features', section: 'features', icon: 'flash-outline' },
                { label: 'Why Choose Us', section: 'benefits', icon: 'shield-checkmark-outline' },
                { label: 'Testimonials', section: 'testimonials', icon: 'star-outline' },
                { label: 'Pricing Plans', section: 'pricing', icon: 'card-outline' },
                { label: 'Contact Us', section: 'contact', icon: 'mail-outline' },
              ].map((item) => (
                <TouchableOpacity
                  key={item.section}
                  style={styles.drawerNavItem}
                  onPress={() => {
                    setDrawerOpen(false);
                    if (item.section === 'brochure') {
                      navigation.navigate('Brochure');
                    } else {
                      scrollToSection(item.section);
                    }
                  }}
                >
                  <Ionicons name={item.icon} size={20} color={darkTheme.primary} />
                  <Text style={styles.drawerNavText}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.drawerActionsBox}>
              <TouchableOpacity
                style={styles.btnDrawerOutline}
                onPress={() => {
                  setDrawerOpen(false);
                  navigation.navigate('Login');
                }}
              >
                <Text style={styles.btnDrawerOutlineText}>Admin Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnDrawerPrimary}
                onPress={() => {
                  setDrawerOpen(false);
                  navigation.navigate('Register', { plan: 'free-trial' });
                }}
              >
                <Text style={styles.btnDrawerPrimaryText}>Start 7-Day Free Trial</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const darkThemeSectionBadgeText = {
  color: darkTheme.primary,
  fontSize: 12,
  fontWeight: 'bold',
  letterSpacing: 1,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.bg,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    backgroundColor: darkTheme.bg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
  },
  brandLogoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnNavOutline: {
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnNavOutlineText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '600',
  },
  btnNavPrimary: {
    backgroundColor: darkTheme.primary,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  btnNavPrimaryText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  btnMenuToggle: {
    paddingLeft: 4,
  },
  scrollBody: {
    paddingBottom: 40,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 24,
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: darkTheme.badgeBg,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    marginBottom: 16,
  },
  heroBadgeText: {
    color: darkTheme.textPrimary,
    fontSize: 12,
    fontWeight: '600',
  },
  heroMainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 38,
  },
  heroGradientText: {
    color: darkTheme.primary,
  },
  heroSubText: {
    fontSize: 14,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 22,
  },
  heroActionsRow: {
    flexDirection: 'column',
    width: '100%',
    gap: 12,
    marginTop: 24,
  },
  btnHeroPrimary: {
    backgroundColor: darkTheme.primary,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  btnHeroPrimaryText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnHeroSecondary: {
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnHeroSecondaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  heroImageWrapper: {
    width: '100%',
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 28,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  statBox: {
    width: (width - 52) / 2,
    backgroundColor: darkTheme.cardBg,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  statNum: {
    fontSize: 22,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  statLbl: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginTop: 4,
  },
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 20,
  },
  centerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: darkTheme.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  leftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: darkTheme.badgeBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  sectionHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  leftSectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  sectionHeaderSub: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  featuresList: {
    gap: 16,
  },
  featureCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  featureIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0f2942',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  featureCardDesc: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    lineHeight: 20,
  },
  featLinkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 12,
  },
  featLinkText: {
    color: darkTheme.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  checklistContainer: {
    marginTop: 16,
    gap: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkText: {
    color: '#e2e8f0',
    fontSize: 14,
    flex: 1,
  },
  btnSeeBenefits: {
    backgroundColor: darkTheme.primary,
    height: 44,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 20,
  },
  btnSeeBenefitsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  metricsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  metricCard: {
    flex: 1,
    backgroundColor: darkTheme.cardBg,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  metricVal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  metricLbl: {
    fontSize: 10,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  quoteCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    marginTop: 24,
  },
  quoteBody: {
    color: '#cbd5e1',
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  quoteAuthorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: darkTheme.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authorName: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  authorSub: {
    color: darkTheme.textMuted,
    fontSize: 12,
  },
  testimonialsGrid: {
    gap: 16,
    marginTop: 16,
  },
  testimonialCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  testiUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  testiText: {
    color: '#cbd5e1',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  pricingList: {
    gap: 16,
    marginTop: 16,
  },
  pricingCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  pricingCardFeatured: {
    borderColor: darkTheme.primary,
    backgroundColor: '#122544',
  },
  popularPill: {
    alignSelf: 'flex-start',
    backgroundColor: darkTheme.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
  },
  popularPillText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
    marginVertical: 10,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  pricePeriod: {
    fontSize: 13,
    color: darkTheme.textSecondary,
  },
  planChecklist: {
    gap: 8,
    marginVertical: 14,
  },
  planCheckItem: {
    color: '#cbd5e1',
    fontSize: 13,
  },
  btnPlan: {
    backgroundColor: darkTheme.cardBorder,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  btnPlanText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ctaBanner: {
    marginHorizontal: 20,
    backgroundColor: '#13284c',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    marginTop: 20,
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  ctaSub: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 18,
  },
  btnCtaLg: {
    backgroundColor: darkTheme.primary,
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnCtaLgText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  footerContainer: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: darkTheme.cardBorder,
    marginTop: 36,
  },
  footerBrandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  footerBrandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  footerDescText: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    lineHeight: 18,
    marginBottom: 20,
  },
  footerSecTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: darkTheme.primary,
    letterSpacing: 1,
    marginBottom: 12,
    marginTop: 8,
  },
  footerQuickNavRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  quickNavChip: {
    backgroundColor: darkTheme.cardBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  quickNavChipText: {
    color: darkTheme.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  contactItemsBox: {
    gap: 10,
    marginBottom: 20,
  },
  contactItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  contactItemText: {
    color: '#e2e8f0',
    fontSize: 12,
  },
  footerBottomLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 16,
  },
  footerBottomLinkText: {
    color: darkTheme.primary,
    fontSize: 12,
  },
  footerCopy: {
    color: darkTheme.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 8,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  drawerContent: {
    backgroundColor: darkTheme.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: darkTheme.cardBorder,
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
  },
  drawerLinksList: {
    paddingVertical: 16,
    gap: 14,
  },
  drawerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 6,
  },
  drawerNavText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  drawerActionsBox: {
    gap: 10,
    marginTop: 12,
  },
  btnDrawerOutline: {
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDrawerOutlineText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  btnDrawerPrimary: {
    backgroundColor: darkTheme.primary,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnDrawerPrimaryText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  whatsappFloat: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#25D366',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 9999,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  socialIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  brochureSectionContainer: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: '#070c1b',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  brochureBannerCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  brochureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: darkTheme.badgeBg,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  brochureBadgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  brochureTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  brochureSubtitle: {
    fontSize: 13,
    color: darkTheme.textSecondary,
    marginBottom: 16,
  },
  btnLaunchBrochureModal: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: darkTheme.primary,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnLaunchBrochureText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  infographicSecHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: darkTheme.primary,
    letterSpacing: 1,
    marginBottom: 14,
  },
  compareGridRow: {
    gap: 12,
  },
  compareBox: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    paddingBottom: 12,
  },
  compareHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  compareHeaderText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  compareItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  compareItemText: {
    fontSize: 12,
  },
  mgmtModuleGrid: {
    gap: 12,
  },
  mgmtModuleCard: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  mgmtModuleIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  mgmtModuleTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  mgmtModuleBullet: {
    fontSize: 12,
    color: darkTheme.textSecondary,
    marginBottom: 4,
  },
  rolesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  roleBoxCard: {
    width: (width - 50) / 2,
    backgroundColor: darkTheme.cardBg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  roleIconEmoji: {
    fontSize: 22,
    marginBottom: 4,
  },
  roleBoxTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  roleBoxSub: {
    fontSize: 11,
    color: darkTheme.textSecondary,
    marginTop: 2,
  },
  stepsHorizontalScroll: {
    alignItems: 'center',
    gap: 8,
    paddingRight: 20,
  },
  stepChipBox: {
    backgroundColor: darkTheme.cardBg,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
    alignItems: 'center',
    width: 120,
  },
  stepNumBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: darkTheme.primary,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 22,
    fontSize: 12,
    marginBottom: 6,
  },
  stepTitleText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  stepDescText: {
    color: darkTheme.textMuted,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  stepArrowText: {
    color: darkTheme.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  kpiMetricsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  kpiCardItem: {
    backgroundColor: darkTheme.cardBg,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: (width - 56) / 3,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  kpiValNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: darkTheme.primary,
  },
  kpiValLbl: {
    fontSize: 10,
    color: darkTheme.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  brochureModalContainer: {
    flex: 1,
    backgroundColor: '#070c1b',
  },
  brochureModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 14,
    backgroundColor: darkTheme.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: darkTheme.cardBorder,
  },
  brochureModalHeaderTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  btnModalTrial: {
    backgroundColor: darkTheme.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },
  btnModalTrialText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  brochureHeroCard: {
    backgroundColor: darkTheme.cardBg,
    padding: 18,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: darkTheme.cardBorder,
  },
  brochureModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 6,
  },
  brochureModalSub: {
    fontSize: 13,
    color: darkTheme.textSecondary,
  },
  modalSecTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: darkTheme.primary,
    marginBottom: 10,
    letterSpacing: 1,
  },
});
