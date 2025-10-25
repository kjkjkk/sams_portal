"use client";

import BottomNavigation from "@/components/bottom-navigation";
import ElectionProcessResult from "@/components/election-process-result";
import Header from "@/components/header";
import StatisticsCards from "@/components/statistics-cards";
import homeStyles from "@/styles/homeStyles";
import { useState } from "react";
import { ScrollView, View } from "react-native";

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const memberStatsCards = [
    {
      id: 1,
      title: "Total Members",
      chartData: {
        labels: ["Admin", "Teachers", "Students"],
        datasets: [{ data: [10, 50, 242] }],
      },
      chartColors: ["#FF6B6B", "#FFD93D", "#6BCB77"],
      count: "322",
    },
    {
      id: 2,
      title: "Members in Good Standing",
      subtitle: "Members who can vote",
      chartData: {
        labels: ["Active", "Inactive"],
        datasets: [{ data: [80, 20] }],
      },
      chartColors: ["#00FF00", "#E0E0E0"],
    },
    {
      id: 3,
      title: "Nominated",
      chartData: {
        labels: ["President", "Vice President", "Secretary"],
        datasets: [{ data: [3, 4, 3] }],
      },
      chartColors: ["#FF1493", "#00FF00", "#4169E1"],
      count: "10",
    },
    {
      id: 4,
      title: "Members in Good Standing",
      subtitle: "Members who can vote",
      chartData: {
        labels: ["Active", "Inactive"],
        datasets: [{ data: [80, 20] }],
      },
      chartColors: ["#00FF00", "#E0E0E0"],
    },
  ];

  const electionCards = [
    {
      id: 1,
      title: "Nominated Members (Board of Trustees)",
      event: "Event Release Calendar",
      date: "October 28, 2025",
      description: "New updates every week",
      details:
        "Check out our weekly game update calendar so you don't miss any of our weekly release! See them all ",
    },
    {
      id: 2,
      title: "Nominated Members (Zone Representative - Davao City)",
      event: "Event Release Calendar",
      date: "October 28, 2025",
      description: "New updates every week",
      details:
        "Check out our weekly game update calendar so you don't miss any of our weekly release! See them all ",
    },
    {
      id: 3,
      title: "Nominated Members (Zone Representative - Davao City)",
      event: "Event Release Calendar",
      date: "October 28, 2025",
      description: "New updates every week",
      details:
        "Check out our weekly game update calendar so you don't miss any of our weekly release! See them all ",
    },
  ];

  return (
    <View style={homeStyles.container}>
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <ScrollView
        style={homeStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <StatisticsCards cards={memberStatsCards} />
        <ElectionProcessResult cards={electionCards} />
      </ScrollView>

      <BottomNavigation />
    </View>
  );
};

export default HomeScreen;
