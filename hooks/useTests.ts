import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const useTests = () => {
  const [tests, setTests] = useState<any[]>([]);

  const getTests = async () => {
    try {
      const snapshot = await getDocs(collection(db, "Detections"));
      const data: any[] = [];

      snapshot.forEach((doc) => {
        // Update this line based on your document field (e.g., `testName`)
        const testData = doc.data();
        data.push(testData);
      });

      console.log("data fetch:", data);
      setTests(data); // Set the tests to the state
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  return { getTests, tests };
};

export default useTests;
