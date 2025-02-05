import { db } from "@/firebaseConfig";
import { DocumentResponse, Post, ProfileInfo } from "@/types";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";

const COLLECTION_NAME = "posts";

export const createPost = (post: Post, displayName: string) => {
  const postWithUser = { ...post, displayName, comments: [] };
  return addDoc(collection(db, COLLECTION_NAME), postWithUser);
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    const tempArr: DocumentResponse[] = [];
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Post;
        const responseObj: DocumentResponse = {
          id: doc.id,
          ...data,
        };
        tempArr.push(responseObj);
      });
      return tempArr;
    } else {
      console.log("No documents found in 'posts'.");
    }
  } catch (error) {
    console.log("Error fetching posts:", error);
  }
};

export const getPostByUserId = (id: string) => {
  const q = query(collection(db, COLLECTION_NAME), where("userId", "==", id));
  return getDocs(q);
};

export const getPost = (id: string) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  return getDoc(docRef);
};

export const deletePost = (id: string) => {
  return deleteDoc(doc(db, COLLECTION_NAME, id));
};

export const updateLikesOnPost = async (
  id: string,
  userlikes: string[],
  likes: number
) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    likes,
    userlikes,
  });
};

export const addCommentToPost = async (postId: string, comments: string[]) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, postId);
    await updateDoc(docRef, { comments });
    console.log("Comments updated successfully.");
  } catch (error) {
    console.error("Error updating comments: ", error);
    throw error;
  }
};

export const updateUserInfoOnPosts = async (profileInfo: ProfileInfo) => {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("userId", "==", profileInfo.user?.uid)
  );
  const querySnapshot = await getDocs(q);
  if (querySnapshot.size > 0) {
    querySnapshot.forEach((document) => {
      const docRef = doc(db, COLLECTION_NAME, document.id);
      updateDoc(docRef, {
        username: profileInfo.displayName,
        photoURL: profileInfo.photoURL,
      });
    });
  } else {
    console.log("User has no posts to update.");
  }
};

export const updatePost = async (id: string, updates: Partial<Post>) => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, updates);

  const updatedSnap = await getDoc(docRef);
  if (updatedSnap.exists()) {
    return { id: updatedSnap.id, ...updatedSnap.data() } as DocumentResponse;
  }
  return null;
};
