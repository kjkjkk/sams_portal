import { useAuth } from "@/contexts/AuthContexts";
import { config, database } from "@/services/appwrite";
import dtrLogStyles from "@/styles/dtrLogStyles";
import { Query } from "appwrite";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const DTRLog = () => {
  const { user, loading: authLoading } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dtrData, setDtrData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalRecords, setTotalRecords] = useState(0);

  useEffect(() => {
    const fetchDTRData = async () => {
      console.log("[DTR] User state:", user);
      console.log("[DTR] stdId:", user?.stdId);

      try {
        setLoading(true);

        if (!user || !user.stdId || user.stdId === 0) {
          console.log("[DTR] No valid user or stdId");
          setError("User ID not found");
          setLoading(false);
          return;
        }

        console.log("[DTR] Fetching records for stdId:", user.stdId);

        const dtrRecords = await database.listDocuments(
          config.databaseId,
          config.collections.dtrSamsCard,
          [
            Query.equal("std_id", user.stdId),
            Query.orderDesc("tme_date"),
            Query.limit(rowsPerPage),
            Query.offset((currentPage - 1) * rowsPerPage),
          ]
        );

        console.log("[DTR] Found records:", dtrRecords.documents.length);

        // Get total count for pagination
        const totalRecordsResult = await database.listDocuments(
          config.databaseId,
          config.collections.dtrSamsCard,
          [
            Query.equal("std_id", user.stdId),
            Query.limit(1), // Just get count, don't need actual data
          ]
        );
        setTotalRecords(totalRecordsResult.total);

        // Get unique school IDs from DTR records
        const accIDs = [
          ...new Set(dtrRecords.documents.map((r) => r.accID)),
        ].filter((id) => id);
        console.log("[DTR] Unique accIDs:", accIDs);

        const schoolMap = {};

        // Fetch school names for each unique accID
        if (accIDs.length > 0) {
          try {
            // Get all schools at once
            const schoolsResponse = await database.listDocuments(
              config.databaseId,
              config.collections.schoolaccounts,
              [Query.limit(100)] // Get all schools
            );

            console.log(
              "[DTR] Schools fetched:",
              schoolsResponse.documents.length
            );

            // Map schools by their schoolid
            schoolsResponse.documents.forEach((school) => {
              if (school.schoolid) {
                schoolMap[school.schoolid] =
                  school.accName2 || school.accName || "Unknown School";
              }
            });

            console.log("[DTR] School map:", schoolMap);
          } catch (schoolErr) {
            console.error("[DTR] Error fetching schools:", schoolErr);
          }
        }

        const enrichedData = dtrRecords.documents.map((record) => {
          const formatTime = (datetime) => {
            if (!datetime) return "N/A";
            try {
              const d = new Date(datetime);
              return d.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });
            } catch {
              return datetime;
            }
          };

          const formatDate = (datetime) => {
            if (!datetime) return "N/A";
            try {
              const d = new Date(datetime);
              return d.toISOString().split("T")[0];
            } catch {
              return datetime;
            }
          };

          return {
            id: record.$id || "N/A",
            name: user.fullName || "Student",
            school: schoolMap[record.accID] || "Unknown",
            timeInAM: formatTime(record.tme_am_in),
            timeOutAM: formatTime(record.tme_am_out),
            timeInPM: formatTime(record.tme_pm_in),
            timeOutPM: formatTime(record.tme_pm_out),
            date: formatDate(record.tme_date),
          };
        });

        console.log("[DTR] Enriched data:", enrichedData.length, "records");
        setDtrData(enrichedData);
        setError(null);
      } catch (err) {
        console.error("[DTR] DTR fetch error:", err);
        setError(`Failed to load DTR data: ${err.message || "Unknown error"}`);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.stdId) {
      fetchDTRData();
    } else if (!authLoading && !user) {
      setLoading(false);
    } else if (!authLoading && user?.stdId === 0) {
      setLoading(false);
      setError("User ID not found");
    }
  }, [user?.stdId, authLoading, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(totalRecords / rowsPerPage) || 1;

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (authLoading || loading) {
    return (
      <View style={dtrLogStyles.centerContainer}>
        <ActivityIndicator size="large" color="#FF8C00" />
        <Text style={dtrLogStyles.loadingText}>
          Loading your DTR records...
        </Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={dtrLogStyles.centerContainer}>
        <Text style={dtrLogStyles.errorText}>
          Please log in to view your DTR records
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={dtrLogStyles.centerContainer}>
        <Text style={dtrLogStyles.errorText}>{error}</Text>
      </View>
    );
  }

  if (dtrData.length === 0) {
    return (
      <View style={dtrLogStyles.centerContainer}>
        <Text style={dtrLogStyles.emptyText}>No DTR records found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={dtrLogStyles.container}
      showsVerticalScrollIndicator={false}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={dtrLogStyles.tableScroll}
      >
        <View style={dtrLogStyles.table}>
          {/* Table Header */}
          <View style={dtrLogStyles.tableRow}>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 50 },
              ]}
            >
              ID
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 120 },
              ]}
            >
              Name
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 100 },
              ]}
            >
              School
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 100 },
              ]}
            >
              Time In (AM)
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 110 },
              ]}
            >
              Time Out (AM)
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 100 },
              ]}
            >
              Time In (PM)
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 110 },
              ]}
            >
              Time Out (PM)
            </Text>
            <Text
              style={[
                dtrLogStyles.tableCell,
                dtrLogStyles.tableHeader,
                { width: 90 },
              ]}
            >
              Date
            </Text>
          </View>

          {/* Table Rows */}
          {dtrData.map((item, index) => (
            <View
              key={item.id + index}
              style={[
                dtrLogStyles.tableRow,
                index % 2 === 0 && dtrLogStyles.tableRowAlt,
              ]}
            >
              <Text
                style={[dtrLogStyles.tableCell, { width: 50 }]}
                numberOfLines={1}
              >
                {index + 1}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 120 }]}>
                {String(item.name)}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 100 }]}>
                {String(item.school)}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 100 }]}>
                {String(item.timeInAM)}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 110 }]}>
                {String(item.timeOutAM)}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 100 }]}>
                {String(item.timeInPM)}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 110 }]}>
                {String(item.timeOutPM)}
              </Text>
              <Text style={[dtrLogStyles.tableCell, { width: 90 }]}>
                {String(item.date)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Pagination Controls */}
      <View style={dtrLogStyles.paginationContainer}>
        <Pressable
          style={[
            dtrLogStyles.paginationButton,
            currentPage === 1 && dtrLogStyles.paginationButtonDisabled,
          ]}
          onPress={handlePreviousPage}
          disabled={currentPage === 1}
        >
          <Text style={dtrLogStyles.paginationButtonText}>Previous</Text>
        </Pressable>
        <Text style={dtrLogStyles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <Pressable
          style={[
            dtrLogStyles.paginationButton,
            currentPage === totalPages && dtrLogStyles.paginationButtonDisabled,
          ]}
          onPress={handleNextPage}
          disabled={currentPage === totalPages}
        >
          <Text style={dtrLogStyles.paginationButtonText}>Next</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default DTRLog;
