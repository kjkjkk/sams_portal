import Imageicn from "@/assets/images/Imageicn.png";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CategoryBadge from "../../components/CategoryBadge";

const NewsDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { item } = route.params || { item: {} };

  if (!item || !item.id) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>News item not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const description =
    item.description ||
    "An evening of elegance, laughter, and unforgettable memories!\n\nLast night, the students of the University of Mindanao came together for a spectacular celebration of unity and achievement at the Annual Gala Night. The event sparkled with glamour as everyone arrived dressed in their finest attire, ready to dance, dine, and celebrate another milestone of student life.\n\nFrom the dazzling performances to the heartfelt awarding ceremonies, every moment reflected the true spirit of UM excellence and camaraderie. It was a night to remember — where friendships were celebrated, dreams were shared, and the soul belonged to the University of Mindanao's brightest stars.";

  const hashtags = item.hashtags || [
    "#UMGalaNight2025",
    "#UniversityOfMindanao",
    "#EleganceAndExcellence",
    "#CollegeLifeMoments",
    "#UMProud",
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text style={styles.welcomeText}>Welcome to INFINITLMS</Text>
            <View style={styles.userSection}>
              <Image source={Imageicn} style={styles.avatar} />
              <Text style={styles.userName}>Whang D. Oda</Text>
            </View>
          </View>
        </View>

        {/* NEWS Title Section */}
        <View style={styles.newsHeaderContainer}>
          <View style={styles.newsIconContainer}>
            <Ionicons name="list" size={20} color="#fff" />
          </View>
          <Text style={styles.newsTitle}>NEWS</Text>
          <View style={styles.divider} />
        </View>

        {/* Detail Content */}
        <View style={styles.detailContainer}>
          {/* Category Badge and Title */}
          <View style={styles.titleSection}>
            <View style={styles.badgeRow}>
              <CategoryBadge category={item.category} />
            </View>
            <Text style={styles.detailTitle}>{item.title}</Text>
          </View>

          {/* Featured Image */}
          <Image
            source={
              item.image || {
                uri: "https://images.unsplash.com/photo-1519671482677-504be0271101?w=500&h=300&fit=crop",
              }
            }
            style={styles.featuredImage}
          />

          {/* Subtitle */}
          <Text style={styles.subtitle}>
            An evening of elegance, laughter, and unforgettable memories!
          </Text>

          {/* Description */}
          <Text style={styles.description}>{description}</Text>

          {/* Hashtags */}
          <View style={styles.hashtagsContainer}>
            {hashtags.map((tag, index) => (
              <Text key={index} style={styles.hashtag}>
                {tag}
              </Text>
            ))}
            <Text style={styles.hearts}>❤️❤️</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    gap: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  backButton: {
    paddingTop: 4,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  userSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  userAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  userName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
  },
  newsHeaderContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  newsIconContainer: {
    backgroundColor: "#000",
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    letterSpacing: 0.5,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
    marginLeft: 4,
  },
  detailContainer: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  titleSection: {
    marginBottom: 16,
  },
  badgeRow: {
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#000",
    lineHeight: 28,
    letterSpacing: -0.5,
  },
  featuredImage: {
    width: "100%",
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    lineHeight: 22,
    marginBottom: 20,
  },
  hashtagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
  },
  hashtag: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  hearts: {
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "#999",
  },
});

export default NewsDetailScreen;
