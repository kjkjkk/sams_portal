"use client";

import BottomNavigation from "@/components/layout/bottom-navigation";
import Header from "@/components/layout/header";
import NewsItem from "@/components/NewsScreen/NewsItem";
import newStyles from "@/styles/appScreenStyles/newsStyles";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const NewsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("Choose a School");
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);

  const schools = ["Choose a School", "MMCM", "SPC", "UM", "UIC"];

  const newsData = [
    {
      id: "1",
      category: "News",
      title: "MMCM - October 22, 2025",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description:
        "An evening of elegance, laughter, and unforgettable memories!",
      fullDescription:
        "Last night, the students of the University of Mindanao came together for a spectacular celebration of unity and achievement at the Annual Gala Night. The event sparkled with glamour as everyone arrived dressed in their finest attire, ready to dance, dine, and celebrate another milestone of student life.\n\nFrom the dazzling performances to the heartfelt awarding ceremonies, every moment reflected the true spirit of UM excellence and camaraderie. It was a night to remember — where friendships were celebrated, dreams were shared, and the soul belonged to the University of Mindanao's brightest stars.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags:
        "#UMGalaNight2025 #UniversityOfMindanao #EleganceAndExcellence #CollegeLifeMoments #UMProud",
    },
    {
      id: "2",
      category: "Announcement",
      title: "SPC - Midterm Examinations",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Important announcement regarding midterm examinations.",
      fullDescription:
        "All students are required to participate in the midterm examinations scheduled for the coming weeks. Please ensure you are prepared and have reviewed all course materials. Examination schedules will be posted on the student portal.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#MidtermExams #SPC #AcademicExcellence",
    },
    {
      id: "3",
      category: "Notice",
      title: "UM - Unclaimed Certificate",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Notice regarding unclaimed certificates.",
      fullDescription:
        "There are several unclaimed certificates waiting to be picked up at the Registrar's Office. Please check the list posted on the bulletin board and claim your certificate during office hours.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#Certificates #UM #Registrar",
    },
    {
      id: "4",
      category: "Update",
      title: "MMCM - Calendar Activities",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Updated calendar of activities for the semester.",
      fullDescription:
        "The calendar of activities has been updated with new events and important dates. Please refer to the updated schedule for all upcoming activities and deadlines.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#CalendarUpdate #MMCM #Activities",
    },
    {
      id: "5",
      category: "News",
      title: "UM -New ID Link",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "New student ID link available.",
      fullDescription:
        "Students can now access their new digital ID through the student portal. This new system provides enhanced security and convenience for all students.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#StudentID #UM #Digital",
    },
    {
      id: "6",
      category: "Notice",
      title: "UIC - Parents Orientation",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Parents orientation session scheduled.",
      fullDescription:
        "All parents are invited to attend the orientation session to learn about the school's programs and facilities. This is an excellent opportunity to meet the faculty and staff.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#ParentsOrientation #UIC #Community",
    },
    {
      id: "7",
      category: "Update",
      title: "MMCM - Calendar Activities",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Updated calendar of activities for the semester.",
      fullDescription:
        "The calendar of activities has been updated with new events and important dates. Please refer to the updated schedule for all upcoming activities and deadlines.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#CalendarUpdate #MMCM #Activities",
    },
    {
      id: "8",
      category: "Announcement",
      title: "SPC - Midterm Examinations",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Important announcement regarding midterm examinations.",
      fullDescription:
        "All students are required to participate in the midterm examinations scheduled for the coming weeks. Please ensure you are prepared and have reviewed all course materials.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#MidtermExams #SPC #AcademicExcellence",
    },
    {
      id: "9",
      category: "Event",
      title: "UM - HIMAMAT 2025: STCAST Gala Night",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description:
        "An evening of elegance, laughter, and unforgettable memories!",
      fullDescription:
        "Last night, the students of the University of Mindanao came together for a spectacular celebration of unity and achievement at the Annual Gala Night. The event sparkled with glamour as everyone arrived dressed in their finest attire, ready to dance, dine, and celebrate another milestone of student life.\n\nFrom the dazzling performances to the heartfelt awarding ceremonies, every moment reflected the true spirit of UM excellence and camaraderie. It was a night to remember — where friendships were celebrated, dreams were shared, and the soul belonged to the University of Mindanao's brightest stars. 💖💖",
      image: require("@/assets/images/Imageicn.png"),
      hashtags:
        "#UMGalaNight2025 #UniversityOfMindanao #EleganceAndExcellence #CollegeLifeMoments #UMProud",
    },
    {
      id: "10",
      category: "Update",
      title: "MMCM - Calendar Activities",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Updated calendar of activities for the semester.",
      fullDescription:
        "The calendar of activities has been updated with new events and important dates. Please refer to the updated schedule for all upcoming activities and deadlines.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#CalendarUpdate #MMCM #Activities",
    },
    {
      id: "11",
      category: "News",
      title: "UM -New ID Link",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "New student ID link available.",
      fullDescription:
        "Students can now access their new digital ID through the student portal. This new system provides enhanced security and convenience for all students.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#StudentID #UM #Digital",
    },
    {
      id: "12",
      category: "Announcement",
      title: "SPC - Midterm Examinations",
      author: "Whang",
      date: "10.22.25",
      avatar: require("@/assets/images/Imageicn.png"),
      description: "Important announcement regarding midterm examinations.",
      fullDescription:
        "All students are required to participate in the midterm examinations scheduled for the coming weeks. Please ensure you are prepared and have reviewed all course materials.",
      image: require("@/assets/images/Imageicn.png"),
      hashtags: "#MidtermExams #SPC #AcademicExcellence",
    },
  ];

  const filteredNews = newsData.filter(
    (item) =>
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.category.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleNewsItemPress = (item) => {
    navigation.navigate("detail", { item });
  };

  // ✅ Added the missing function
  const handleCreateArticle = () => {
    // Navigate to create article screen or open modal
    console.log("Create new article");
    // Example: navigation.navigate("CreateArticle");
  };

  return (
    <SafeAreaView style={newStyles.container}>
      <ScrollView
        style={newStyles.scrollView}
        contentContainerStyle={newStyles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        {/* <View style={newStyles.header}>
          <View style={newStyles.headerContent}>
            <Text style={newStyles.welcomeText}>Welcome to INFINITLMS</Text>
            <View style={newStyles.userSection}>
              <Image
                source={require("@/assets/images/Imageicn.png")}
                style={newStyles.userAvatar}
              />
              <Text style={newStyles.userName}>Whang D. Oda</Text>
            </View>
          </View>
          <View style={newStyles.logoSection}>
            <Ionicons name="bulb" size={48} color="#FF9500" />
            <Text style={newStyles.logoText}>INFINIT LMS</Text>
          </View>
        </View> */}
        <Header />

        {/* NEWS Title Section */}
        <View style={newStyles.newsHeaderContainer}>
          <View style={newStyles.newsIconContainer}>
            <Ionicons name="list" size={20} color="#fff" />
          </View>
          <Text style={newStyles.newsTitle}>News</Text>
          <View style={newStyles.divider} />
        </View>

        {/* School Dropdown */}
        <View style={newStyles.dropdownWrapper}>
          <TouchableOpacity
            style={newStyles.dropdown}
            onPress={() => setShowSchoolDropdown(!showSchoolDropdown)}
          >
            <Text style={newStyles.dropdownText}>{selectedSchool}</Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
          {showSchoolDropdown && (
            <View style={newStyles.dropdownMenu}>
              {schools.map((school) => (
                <TouchableOpacity
                  key={school}
                  style={newStyles.dropdownItem}
                  onPress={() => {
                    setSelectedSchool(school);
                    setShowSchoolDropdown(false);
                  }}
                >
                  <Text style={newStyles.dropdownItemText}>{school}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Search and Create Button */}
        {/* <SearchFilter
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search News..."
          showButton={true}
          buttonText="Create Article"
          buttonIcon="add"
          onButtonPress={handleCreateArticle}
        /> */}

        {/* News Items List */}
        <View style={newStyles.newsList}>
          {filteredNews.length > 0 ? (
            filteredNews.map((item) => (
              <TouchableOpacity>
                <NewsItem item={item} />
              </TouchableOpacity>
            ))
          ) : (
            <View style={newStyles.emptyState}>
              <Text style={newStyles.emptyStateText}>No news found</Text>
            </View>
          )}
        </View>
      </ScrollView>
      <BottomNavigation />
    </SafeAreaView>
  );
};

const getCategoryColor = (category) => {
  const colors = {
    News: "#FF3B30",
    Announcement: "#FF2D55",
    Notice: "#FF9500",
    Update: "#2196F3",
    Event: "#4CAF50",
  };
  return colors[category] || "#999";
};

export default NewsScreen;
