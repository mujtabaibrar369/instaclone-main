import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "@/redux/postSlice";

const CreatePost = ({ open, setOpen }) => {
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState("");
  const [mediaPreview, setMediaPreview] = useState("");
  const [mediaType, setMediaType] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { posts } = useSelector((store) => store.post);
  const dispatch = useDispatch();

  const fileChangeHandler = async (e) => {
    const selectedFile = e.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) {
      const type = selectedFile.type.startsWith("video") ? "video" : "image";
      setFile(selectedFile);
      setMediaType(type);

      const dataUrl = await readFileAsDataURL(selectedFile);
      setMediaPreview(dataUrl);
    }
  };

  const createPostHandler = async () => {
    if (!file) {
      toast.error("Please select a media file.");
      return;
    }

    const formData = new FormData();
    formData.append("caption", caption);
    formData.append("file", file); // Changed field name to "file" to match backend
    formData.append("mediaType", mediaType);

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/v1/post/addpost",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setOpen(false);
        resetState();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create post.");
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setFile(null);
    setCaption("");
    setMediaPreview("");
    setMediaType("");
  };

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create New Post
        </DialogHeader>

        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="font-semibold text-xs">{user?.username}</h1>
            <span className="text-gray-600 text-xs">Bio here...</span>
          </div>
        </div>

        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="Write a caption..."
        />

        {mediaPreview && (
          <div className="w-full h-64 flex items-center justify-center rounded-md overflow-hidden">
            {mediaType === "image" ? (
              <img
                src={mediaPreview}
                alt="preview"
                className="object-cover h-full w-full"
              />
            ) : (
              <video controls className="object-cover h-full w-full">
                <source src={mediaPreview} type={file?.type} />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={fileChangeHandler}
        />

        <Button
          onClick={() => fileRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#258bcf]"
        >
          Select from computer
        </Button>

        {mediaPreview &&
          (loading ? (
            <Button disabled className="w-full">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : (
            <Button
              onClick={createPostHandler}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
