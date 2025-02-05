import { db } from "@/firebaseConfig";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  updateDoc,
  query,
  where,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { ProfileResponse, UserProfile } from "@/types";

const COLLECTION_NAME = "users";

export const createUserProfile = async (user: UserProfile) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), user);
    return docRef.id;
  } catch (err) {
    console.log(err);
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    let tempData: ProfileResponse = {};
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;
        tempData = {
          id: doc.id,
          ...userData,
        };
      });
      return tempData;
    } else {
      console.log("No user found.");
      return tempData;
    }
  } catch (err) {
    console.error(err);
  }
};

export const updateUserProfile = async (id: string, user: UserProfile) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return updateDoc(docRef, {
    ...user,
  });
};

export const getAllUsers = async (userId: string) => {
  try {
    const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    const tempArr: ProfileResponse[] = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const userData = doc.data() as UserProfile;
        const responseObj: ProfileResponse = {
          id: doc.id,
          ...userData,
        };
        tempArr.push(responseObj);
      });
      return tempArr.filter((item) => item.userId !== userId);
    } else {
      console.log("Document empty.");
    }
  } catch (err) {
    console.error(err);
  }
};

/* ─────────────────────────────────────────────────────────────
   Funkcje follow/unfollow
────────────────────────────────────────────────────────────── */

export const followUser = async (targetUserId: string, currentUserId: string) => {
  try {
    const targetUserRef = doc(db, COLLECTION_NAME, targetUserId);
    await updateDoc(targetUserRef, {
      followers: arrayUnion(currentUserId),
    });

    const currentUserQuery = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", currentUserId)
    );
    const currentUserSnapshot = await getDocs(currentUserQuery);
    currentUserSnapshot.forEach(async (docSnap) => {
      const currentUserRef = doc(db, COLLECTION_NAME, docSnap.id);
      await updateDoc(currentUserRef, {
        following: arrayUnion(targetUserId),
      });
    });

    return true;
  } catch (error) {
    console.error("Error following user:", error);
    return false;
  }
};

export const unfollowUser = async (targetUserId: string, currentUserId: string) => {
  try {
    const targetUserRef = doc(db, COLLECTION_NAME, targetUserId);
    await updateDoc(targetUserRef, {
      followers: arrayRemove(currentUserId),
    });

    const currentUserQuery = query(
      collection(db, COLLECTION_NAME),
      where("userId", "==", currentUserId)
    );
    const currentUserSnapshot = await getDocs(currentUserQuery);
    currentUserSnapshot.forEach(async (docSnap) => {
      const currentUserRef = doc(db, COLLECTION_NAME, docSnap.id);
      await updateDoc(currentUserRef, {
        following: arrayRemove(targetUserId),
      });
    });

    return true;
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return false;
  }
};
