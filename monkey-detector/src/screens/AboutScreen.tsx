import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from '../components/BackButton';
import { GlassCard } from '../components/GlassCard';
import { fontSF } from '../theme/typography';
import { colors } from '../theme/colors';

interface AboutScreenProps {
  onBack: () => void;
}

export const AboutScreen: React.FC<AboutScreenProps> = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header with Global BackButton */}
        <View style={styles.topRow}>
          <BackButton onPress={onBack} title="Back" />
          <Text style={styles.headerTag}>SYSTEM OVERVIEW</Text>
        </View>

        {/* Display Title */}
        <View style={styles.titleSection}>
          <Text style={styles.displayTitle}>About & Vision</Text>
          <Text style={styles.displaySub}>
            Early detection and humane mitigation of primate-human conflict
          </Text>
        </View>

        {/* Section 1: Current Motive */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>01</Text>
            </View>
            <Text style={styles.cardTitle}>Current Motive</Text>
          </View>
          <Text style={styles.bodyParagraph}>
            The Primate Deterrence System was engineered to address the escalating challenge of wild ape and monkey intrusion into educational hostels and residential campus zones. By enabling rapid image-based verification, the application mitigates human-wildlife conflict, safeguards residents, and equips campus wardens and security personnel with immediate, non-invasive tools to confirm sightings and initiate humane response protocols.
          </Text>
        </GlassCard>

        {/* Section 2: Current Capabilities */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>02</Text>
            </View>
            <Text style={styles.cardTitle}>Current Capabilities</Text>
          </View>
          <View style={styles.featureList}>
            <FeatureItem title="AI-Driven Vision" desc="High-accuracy binary deep learning classification model tailored for primate identification." />
            <FeatureItem title="Dual Scan Modes" desc="Instant manual upload from photo gallery or real-time live camera capture with scanning overlay." />
            <FeatureItem title="Confidence Analytics" desc="Quantified detection confidence scores and model processing latency metrics." />
            <FeatureItem title="Local Incident History" desc="Persistent on-device logging of past scan events, timestamps, and detection verdicts." />
          </View>
        </GlassCard>

        {/* Section 3: Future Integrations */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>03</Text>
            </View>
            <Text style={styles.cardTitle}>Future Roadmap</Text>
          </View>
          <Text style={styles.bodyParagraph}>
            Our upcoming deployment phases expand from manual app scanning to an autonomous, end-to-end edge ecosystem:
          </Text>
          <View style={styles.bulletList}>
            <BulletPoint text="Automated NOIR (Night-Vision Infra-Red) camera modules paired with Raspberry Pi edge hardware and Passive Infra-Red (PIR) motion sensors for continuous 24/7 autonomous monitoring." />
            <BulletPoint text="Automated humane deterrence mechanisms utilizing frequency-tuned bio-acoustic repellents and non-injurious strobe light sequences." />
            <BulletPoint text="Multi-node mesh coverage grid enabling real-time push notifications across full campus perimeters." />
            <BulletPoint text="Role-based administration dashboards for hostel wardens, security dispatchers, and wildlife safety officers." />
          </View>
        </GlassCard>

        {/* Section 4: Industry & Sector Applications */}
        <GlassCard style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>04</Text>
            </View>
            <Text style={styles.cardTitle}>Sector Applications</Text>
          </View>
          <Text style={styles.bodyParagraph}>
            Beyond university hostels, this computer-vision approach scales to critical sectors suffering from wildlife encroachment:
          </Text>

          <SectorTile
            title="Educational Campuses & Hostels"
            desc="Primary deployment domain safeguarding student dormitories, dining halls, and campus grounds."
          />
          <SectorTile
            title="Forestry & Wildlife Authorities"
            desc="Monitoring high-density human-wildlife conflict corridors and forest boundary zones."
          />
          <SectorTile
            title="Agricultural Estates & Farms"
            desc="Protecting high-value commercial crops, orchards, and livestock facilities from foraging troops."
          />
          <SectorTile
            title="Eco-Tourism Resorts & Sanctuaries"
            desc="Providing non-disruptive guest safety alerts while preserving natural animal habitats."
          />
          <SectorTile
            title="Gated Residential Communities"
            desc="Establishing perimeter safety buffers for suburban developments adjacent to forest belts."
          />
          <SectorTile
            title="Corporate & Research Campuses"
            desc="Securing open green spaces, rooftop dining hubs, and sensitive outdoor research facilities."
          />
        </GlassCard>

        <Text style={styles.footerNote}>Primate Deterrence System · Vision & Architecture</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const FeatureItem = ({ title, desc }: { title: string; desc: string }) => (
  <View style={styles.featureItem}>
    <Text style={styles.featureTitle}>{title}</Text>
    <Text style={styles.featureDesc}>{desc}</Text>
  </View>
);

const BulletPoint = ({ text }: { text: string }) => (
  <View style={styles.bulletRow}>
    <Text style={styles.bulletChar}>-</Text>
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);

const SectorTile = ({ title, desc }: { title: string; desc: string }) => (
  <View style={styles.sectorTile}>
    <Text style={styles.sectorTitle}>{title}</Text>
    <Text style={styles.sectorDesc}>{desc}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  scrollContent: { paddingHorizontal: 20, paddingTop: 14, paddingBottom: 40 },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerTag: {
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '600',
    color: colors.olive,
    letterSpacing: 1.5,
  },

  titleSection: { marginBottom: 24 },
  displayTitle: {
    fontFamily: fontSF,
    fontSize: 30,
    fontWeight: '700',
    color: colors.deepGreen,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  displaySub: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    color: colors.olive,
    lineHeight: 18,
  },

  card: { marginBottom: 18 },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  sectionBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.20)',
  },
  sectionBadgeText: {
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '700',
    color: colors.midGreen,
  },
  cardTitle: {
    fontFamily: fontSF,
    fontSize: 20,
    fontWeight: '700',
    color: colors.deepGreen,
  },
  bodyParagraph: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    color: colors.deepGreen,
    lineHeight: 21,
    marginBottom: 10,
  },

  featureList: { gap: 10, marginTop: 4 },
  featureItem: {
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: colors.mint,
    paddingVertical: 2,
  },
  featureTitle: {
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '600',
    color: colors.deepGreen,
    marginBottom: 2,
  },
  featureDesc: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '400',
    color: colors.olive,
    lineHeight: 17,
  },

  bulletList: { gap: 8, marginTop: 6 },
  bulletRow: { flexDirection: 'row', gap: 8, paddingRight: 8 },
  bulletChar: { fontFamily: fontSF, fontSize: 14, color: colors.midGreen, fontWeight: '700' },
  bulletText: {
    flex: 1,
    fontFamily: fontSF,
    fontSize: 14,
    fontWeight: '400',
    color: colors.deepGreen,
    lineHeight: 19,
  },

  sectorTile: {
    backgroundColor: 'rgba(255, 255, 255, 0.60)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 112, 92, 0.18)',
  },
  sectorTitle: {
    fontFamily: fontSF,
    fontSize: 15,
    fontWeight: '700',
    color: colors.deepGreen,
    marginBottom: 3,
  },
  sectorDesc: {
    fontFamily: fontSF,
    fontSize: 13,
    fontWeight: '400',
    color: colors.olive,
    lineHeight: 17,
  },

  footerNote: {
    textAlign: 'center',
    fontFamily: fontSF,
    fontSize: 12,
    fontWeight: '400',
    color: colors.olive,
    marginTop: 16,
  },
});
