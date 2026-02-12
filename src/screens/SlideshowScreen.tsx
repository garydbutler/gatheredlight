import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { GatheredText } from '../components/GatheredText';
import { colors, spacing } from '../lib/theme';

const { width, height } = Dimensions.get('window');

interface SlideData {
  type: 'title' | 'photo' | 'story' | 'end';
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  author?: string;
  relationship?: string;
}

const DEMO_SLIDES: SlideData[] = [
  {
    type: 'title',
    title: 'Margaret Eleanor Wilson',
    subtitle: 'March 15, 1942 — November 28, 2024',
  },
  {
    type: 'story',
    title: 'Her Famous Apple Pie',
    content: 'Every Thanksgiving, Grandma would wake up at 4am to start her apple pie. She never wrote down the recipe — said the secret was in the love you put into it.',
    author: 'Sarah Wilson',
    relationship: 'Granddaughter',
  },
  {
    type: 'photo',
    title: 'Christmas 2019',
    imageUrl: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
    author: 'Emily Chen',
  },
  {
    type: 'story',
    title: 'Dancing in the Rain',
    content: 'Mom always said life was too short to wait for the storm to pass. One summer afternoon, she grabbed my hand and we danced in the rain right in the front yard.',
    author: 'David Wilson',
    relationship: 'Son',
  },
  {
    type: 'end',
    title: 'Forever in our hearts',
    subtitle: 'A tribute by those who loved her most',
  },
];

export const SlideshowScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      // Ken Burns: gentle zoom
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start(() => {
        const nextSlide = (currentSlide + 1) % DEMO_SLIDES.length;
        setCurrentSlide(nextSlide);
        scaleAnim.setValue(1);
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 6000,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 6000);

    // Start Ken Burns on mount
    Animated.timing(scaleAnim, {
      toValue: 1.05,
      duration: 6000,
      useNativeDriver: true,
    }).start();

    return () => clearTimeout(timer);
  }, [currentSlide, isPlaying]);

  const slide = DEMO_SLIDES[currentSlide];

  const renderSlide = () => {
    switch (slide.type) {
      case 'title':
      case 'end':
        return (
          <View style={styles.titleSlide}>
            <View style={styles.candleIcon}>
              <Ionicons
                name={slide.type === 'title' ? 'flame' : 'heart'}
                size={36}
                color={colors.amber[400]}
              />
            </View>
            <GatheredText variant="h1" center style={styles.slideTitle}>
              {slide.title}
            </GatheredText>
            {slide.subtitle && (
              <GatheredText variant="body" center style={styles.slideSubtitle}>
                {slide.subtitle}
              </GatheredText>
            )}
          </View>
        );
      case 'photo':
        return (
          <View style={styles.photoSlide}>
            <Animated.Image
              source={{ uri: slide.imageUrl }}
              style={[styles.slideImage, { transform: [{ scale: scaleAnim }] }]}
              resizeMode="cover"
            />
            <View style={styles.photoOverlay} />
            <View style={styles.photoCaption}>
              <GatheredText variant="h3" style={{ color: colors.warm.white }}>
                {slide.title}
              </GatheredText>
              {slide.author && (
                <GatheredText variant="caption" style={{ color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>
                  Shared by {slide.author}
                </GatheredText>
              )}
            </View>
          </View>
        );
      case 'story':
        return (
          <View style={styles.storySlide}>
            <Ionicons name="chatbubble-outline" size={28} color={colors.amber[300]} />
            <GatheredText variant="h3" center style={styles.storyTitle}>
              {slide.title}
            </GatheredText>
            <GatheredText variant="quote" center style={styles.storyContent}>
              "{slide.content}"
            </GatheredText>
            <GatheredText variant="caption" center style={styles.storyAuthor}>
              — {slide.author}
              {slide.relationship ? `, ${slide.relationship}` : ''}
            </GatheredText>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.slideContainer, { opacity: fadeAnim }]}>
        {renderSlide()}
      </Animated.View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.controlButton}>
          <Ionicons name="close" size={24} color="rgba(255,255,255,0.8)" />
        </TouchableOpacity>

        <View style={styles.progressBar}>
          {DEMO_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressDot,
                index === currentSlide && styles.progressDotActive,
                index < currentSlide && styles.progressDotDone,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => setIsPlaying(!isPlaying)}
          style={styles.controlButton}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color="rgba(255,255,255,0.8)"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.earth[900],
  },
  slideContainer: {
    flex: 1,
  },
  controls: {
    position: 'absolute',
    top: 50,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: spacing.md,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  progressDotActive: {
    backgroundColor: colors.amber[400],
    width: 20,
  },
  progressDotDone: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  titleSlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.earth[800],
  },
  candleIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(245,166,35,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  slideTitle: {
    color: colors.cream[100],
    fontSize: 34,
    marginBottom: spacing.md,
  },
  slideSubtitle: {
    color: colors.cream[300],
    fontStyle: 'italic',
  },
  photoSlide: {
    flex: 1,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  photoOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  photoCaption: {
    position: 'absolute',
    bottom: 100,
    left: spacing.xl,
    right: spacing.xl,
  },
  storySlide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.earth[800],
  },
  storyTitle: {
    color: colors.cream[200],
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  storyContent: {
    color: colors.cream[300],
    lineHeight: 30,
    fontSize: 18,
  },
  storyAuthor: {
    color: colors.amber[300],
    marginTop: spacing.lg,
  },
});
