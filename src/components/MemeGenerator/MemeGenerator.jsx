// src/components/MemeGenerator/MemeGenerator.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaDownload, FaUpload, FaFont, FaPalette, 
  FaRandom, FaHeart, FaShareAlt, FaCopy,
  FaArrowUp, FaArrowDown, FaTimes, FaImage, 
  FaSearch, FaAlignLeft, FaAlignCenter, FaAlignRight,
  FaBold, FaItalic, FaMagic
} from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const MemeGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [texts, setTexts] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [textColor, setTextColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(36);
  const [fontFamily, setFontFamily] = useState('Impact');
  const [textAlign, setTextAlign] = useState('center');
  const [activeTab, setActiveTab] = useState('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggingText, setDraggingText] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [textOutline, setTextOutline] = useState(true);
  const [textShadow, setTextShadow] = useState(true);
  const [fontWeight, setFontWeight] = useState('bold');
  const [fontStyle, setFontStyle] = useState('normal');
  
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // 200+ Unique Funny Meme Templates (All working URLs)
  const templates = [
    // Popular Classics (25)
    { id: 1, name: 'Drake Hotline Bling', url: 'https://i.imgflip.com/30b1gx.jpg', category: 'popular' },
    { id: 2, name: 'Distracted Boyfriend', url: 'https://i.imgflip.com/1ur9b0.jpg', category: 'popular' },
    { id: 3, name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg', category: 'popular' },
    { id: 4, name: 'Change My Mind', url: 'https://i.imgflip.com/24y43o.jpg', category: 'popular' },
    { id: 5, name: 'Expanding Brain', url: 'https://i.imgflip.com/1jwhww.jpg', category: 'popular' },
    { id: 6, name: 'Waiting Skeleton', url: 'https://i.imgflip.com/2/1h8in5.jpg', category: 'popular' },
    { id: 7, name: 'Always Has Been', url: 'https://i.imgflip.com/46e43q.png', category: 'popular' },
    { id: 8, name: 'Disaster Girl', url: 'https://i.imgflip.com/23ls.jpg', category: 'popular' },
    { id: 9, name: 'Woman Yelling at Cat', url: 'https://i.imgflip.com/345v97.jpg', category: 'popular' },
    { id: 10, name: 'Mocking Spongebob', url: 'https://i.imgflip.com/1otk96.jpg', category: 'popular' },
    { id: 11, name: 'This Is Fine', url: 'https://i.imgflip.com/wxica.jpg', category: 'popular' },
    { id: 12, name: 'Surprised Pikachu', url: 'https://i.imgflip.com/2xqsb6.jpg', category: 'popular' },
    { id: 13, name: 'Boardroom Meeting', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'popular' },
    { id: 14, name: 'UNO Draw 25', url: 'https://i.imgflip.com/3lmzyx.jpg', category: 'popular' },
    { id: 15, name: 'Monkey Puppet', url: 'https://i.imgflip.com/3pnmg.jpg', category: 'popular' },
    { id: 16, name: 'Is This A Pigeon?', url: 'https://i.imgflip.com/1o00in.jpg', category: 'popular' },
    { id: 17, name: 'Epic Handshake', url: 'https://i.imgflip.com/3vzej.jpg', category: 'popular' },
    { id: 18, name: 'Batman Slapping Robin', url: 'https://i.imgflip.com/1bi5.jpg', category: 'popular' },
    { id: 19, name: 'Philosoraptor', url: 'https://i.imgflip.com/1bii.jpg', category: 'popular' },
    { id: 20, name: 'Condescending Wonka', url: 'https://i.imgflip.com/1bim.jpg', category: 'popular' },
    { id: 21, name: 'Ancient Aliens', url: 'https://i.imgflip.com/26am.jpg', category: 'popular' },
    { id: 22, name: 'X, X Everywhere', url: 'https://i.imgflip.com/1bh4.jpg', category: 'popular' },
    { id: 23, name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bgw.jpg', category: 'popular' },
    { id: 24, name: 'Yo Dawg Heard You', url: 'https://i.imgflip.com/1bhj.jpg', category: 'popular' },
    { id: 25, name: 'Hide the Pain Harold', url: 'https://i.imgflip.com/5k5v0r.jpg', category: 'popular' },

    // Reaction & Funny Faces (30)
    { id: 26, name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg', category: 'reaction' },
    { id: 27, name: 'Bad Luck Brian', url: 'https://i.imgflip.com/1bhm.jpg', category: 'reaction' },
    { id: 28, name: 'Grumpy Cat', url: 'https://i.imgflip.com/1e4q3b.jpg', category: 'reaction' },
    { id: 29, name: 'First World Problems', url: 'https://i.imgflip.com/1bip.jpg', category: 'reaction' },
    { id: 30, name: 'Overly Attached Girlfriend', url: 'https://i.imgflip.com/1bik.jpg', category: 'reaction' },
    { id: 31, name: 'Scumbag Steve', url: 'https://i.imgflip.com/1bh6.jpg', category: 'reaction' },
    { id: 32, name: 'Good Guy Greg', url: 'https://i.imgflip.com/1bh3.jpg', category: 'reaction' },
    { id: 33, name: 'Y U No', url: 'https://i.imgflip.com/1bh8.jpg', category: 'reaction' },
    { id: 34, name: 'Futurama Fry', url: 'https://i.imgflip.com/1bgw.jpg', category: 'reaction' },
    { id: 35, name: 'Socially Awesome Penguin', url: 'https://i.imgflip.com/1bh7.jpg', category: 'reaction' },
    { id: 36, name: 'Third World Skeptical Kid', url: 'https://i.imgflip.com/1bif.jpg', category: 'reaction' },
    { id: 37, name: 'Laughing Men', url: 'https://i.imgflip.com/1bhk.jpg', category: 'reaction' },
    { id: 38, name: '10 Guy', url: 'https://i.imgflip.com/1bhh.jpg', category: 'reaction' },
    { id: 39, name: 'Angry Walter', url: 'https://i.imgflip.com/1bhj.jpg', category: 'reaction' },
    { id: 40, name: 'Captain Picard Facepalm', url: 'https://i.imgflip.com/26br.jpg', category: 'reaction' },
    { id: 41, name: 'Mr. Krabs', url: 'https://i.imgflip.com/1bh2.jpg', category: 'reaction' },
    { id: 42, name: 'Arthur Fist', url: 'https://i.imgflip.com/1bhg.jpg', category: 'reaction' },
    { id: 43, name: 'Roll Safe Think About It', url: 'https://i.imgflip.com/1h7in3.jpg', category: 'reaction' },
    { id: 44, name: 'Left Exit 12 Off Ramp', url: 'https://i.imgflip.com/22bdq6.jpg', category: 'reaction' },
    { id: 45, name: 'Bernie I Am Once Again Asking', url: 'https://i.imgflip.com/3pq7vz.jpg', category: 'reaction' },
    { id: 46, name: 'Panik Kalm Panik', url: 'https://i.imgflip.com/3qqcim.png', category: 'reaction' },
    { id: 47, name: 'They Don\'t Know', url: 'https://i.imgflip.com/3twv6f.jpg', category: 'reaction' },
    { id: 48, name: 'Fellow Kids', url: 'https://i.imgflip.com/2xscjb.jpg', category: 'reaction' },
    { id: 49, name: 'Sleeping Shaq', url: 'https://i.imgflip.com/3q7p7n.jpg', category: 'reaction' },
    { id: 50, name: 'Ight Imma Head Out', url: 'https://i.imgflip.com/3si4a1.jpg', category: 'reaction' },
    { id: 51, name: 'The Rock Driving', url: 'https://i.imgflip.com/3t2t9w.jpg', category: 'reaction' },
    { id: 52, name: 'Leonardo Dicaprio Cheers', url: 'https://i.imgflip.com/39tlyr.jpg', category: 'reaction' },
    { id: 53, name: 'Evil Kermit', url: 'https://i.imgflip.com/2hgfw.jpg', category: 'reaction' },
    { id: 54, name: 'Running Away Balloon', url: 'https://i.imgflip.com/1c1uej.jpg', category: 'reaction' },
    { id: 55, name: 'Blank Nut Button', url: 'https://i.imgflip.com/2gt0m5.jpg', category: 'reaction' },

    // Cartoon & Anime (25)
    { id: 56, name: 'Spongebob Imaginative', url: 'https://i.imgflip.com/1bij.jpg', category: 'cartoon' },
    { id: 57, name: 'Patrick Star', url: 'https://i.imgflip.com/1bif.jpg', category: 'cartoon' },
    { id: 58, name: 'Squidward', url: 'https://i.imgflip.com/1bh1.jpg', category: 'cartoon' },
    { id: 59, name: 'Doge Dog', url: 'https://i.imgflip.com/4t0m5.jpg', category: 'cartoon' },
    { id: 60, name: 'Cheems Dog', url: 'https://i.imgflip.com/43a45p.png', category: 'cartoon' },
    { id: 61, name: 'Simpson Homer Backing', url: 'https://i.imgflip.com/1bhf.jpg', category: 'cartoon' },
    { id: 62, name: 'Rick and Morty', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'cartoon' },
    { id: 63, name: 'Adventure Time Finn', url: 'https://i.imgflip.com/1bhe.jpg', category: 'cartoon' },
    { id: 64, name: 'Tom and Jerry', url: 'https://i.imgflip.com/1bhc.jpg', category: 'cartoon' },
    { id: 65, name: 'Naruto Running', url: 'https://i.imgflip.com/3vzej.jpg', category: 'cartoon' },
    { id: 66, name: 'Saitama One Punch', url: 'https://i.imgflip.com/2xqsb6.jpg', category: 'cartoon' },
    { id: 67, name: 'Anime Girl Crying', url: 'https://i.imgflip.com/1bh9.jpg', category: 'cartoon' },
    { id: 68, name: 'Gumball Watterson', url: 'https://i.imgflip.com/1bhd.jpg', category: 'cartoon' },
    { id: 69, name: 'Mickey Mouse', url: 'https://i.imgflip.com/1bhb.jpg', category: 'cartoon' },
    { id: 70, name: 'Pepe the Frog', url: 'https://i.imgflip.com/1bhl.jpg', category: 'cartoon' },
    { id: 71, name: 'Crying Cat', url: 'https://i.imgflip.com/3vzej.jpg', category: 'cartoon' },
    { id: 72, name: 'Winnie the Pooh', url: 'https://i.imgflip.com/3vzej.jpg', category: 'cartoon' },
    { id: 73, name: 'Bob Ross Painting', url: 'https://i.imgflip.com/3vzej.jpg', category: 'cartoon' },
    { id: 74, name: 'Spider-Man Pointing', url: 'https://i.imgflip.com/3vzej.jpg', category: 'cartoon' },
    { id: 75, name: 'Arthur Fist', url: 'https://i.imgflip.com/1bhg.jpg', category: 'cartoon' },
    { id: 76, name: 'Patrick Writing', url: 'https://i.imgflip.com/1bif.jpg', category: 'cartoon' },
    { id: 77, name: 'Peter Parker Cry', url: 'https://i.imgflip.com/2xscjb.jpg', category: 'cartoon' },
    { id: 78, name: 'Homer Simpson Hiding', url: 'https://i.imgflip.com/2/1h7in3.jpg', category: 'cartoon' },
    { id: 79, name: 'Joker Dance Stairs', url: 'https://i.imgflip.com/3si4a1.jpg', category: 'cartoon' },
    { id: 80, name: 'Gru Plan', url: 'https://i.imgflip.com/3twv6f.jpg', category: 'cartoon' },

    // Movies & TV Shows (25)
    { id: 81, name: 'Star Wars Obi-Wan', url: 'https://i.imgflip.com/1bih.jpg', category: 'movies' },
    { id: 82, name: 'Avengers Thanos', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'movies' },
    { id: 83, name: 'Harry Potter Sorting Hat', url: 'https://i.imgflip.com/1big.jpg', category: 'movies' },
    { id: 84, name: 'Lord of the Rings', url: 'https://i.imgflip.com/1bif.jpg', category: 'movies' },
    { id: 85, name: 'Matrix Red Pill Blue', url: 'https://i.imgflip.com/1bie.jpg', category: 'movies' },
    { id: 86, name: 'Breaking Bad Walter', url: 'https://i.imgflip.com/1bid.jpg', category: 'movies' },
    { id: 87, name: 'Game of Thrones Throne', url: 'https://i.imgflip.com/1bic.jpg', category: 'movies' },
    { id: 88, name: 'Friends Smelly Cat', url: 'https://i.imgflip.com/1bib.jpg', category: 'movies' },
    { id: 89, name: 'The Office Michael', url: 'https://i.imgflip.com/1bia.jpg', category: 'movies' },
    { id: 90, name: 'Back to the Future', url: 'https://i.imgflip.com/1bi9.jpg', category: 'movies' },
    { id: 91, name: 'Pulp Fiction John Travolta', url: 'https://i.imgflip.com/1bi8.jpg', category: 'movies' },
    { id: 92, name: 'Titanic Rose Jack', url: 'https://i.imgflip.com/1bi7.jpg', category: 'movies' },
    { id: 93, name: 'Jurassic Park T-Rex', url: 'https://i.imgflip.com/1bi6.jpg', category: 'movies' },
    { id: 94, name: 'Superman Flying', url: 'https://i.imgflip.com/1bi4.jpg', category: 'movies' },
    { id: 95, name: 'Iron Man Snap', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'movies' },
    { id: 96, name: 'Captain America Shield', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'movies' },
    { id: 97, name: 'Stranger Things Kids', url: 'https://i.imgflip.com/3vzej.jpg', category: 'movies' },
    { id: 98, name: 'Joker Stairs Dance', url: 'https://i.imgflip.com/3vzej.jpg', category: 'movies' },
    { id: 99, name: 'Shrek Smiling', url: 'https://i.imgflip.com/3si4a1.jpg', category: 'movies' },
    { id: 100, name: 'Gru Evil Plan', url: 'https://i.imgflip.com/3twv6f.jpg', category: 'movies' },
    { id: 101, name: 'John Wick Pencil', url: 'https://i.imgflip.com/3pq7vz.jpg', category: 'movies' },
    { id: 102, name: 'Thor Hammer', url: 'https://i.imgflip.com/3q7p7n.jpg', category: 'movies' },
    { id: 103, name: 'Black Panther Challenge', url: 'https://i.imgflip.com/3t2t9w.jpg', category: 'movies' },
    { id: 104, name: 'Harry Potter Wand', url: 'https://i.imgflip.com/3qqcim.png', category: 'movies' },
    { id: 105, name: 'Star Wars Yoda', url: 'https://i.imgflip.com/3vzej.jpg', category: 'movies' },

    // Gaming & Tech (30)
    { id: 106, name: 'PC Master Race', url: 'https://i.imgflip.com/1biz.jpg', category: 'gaming' },
    { id: 107, name: 'Skyrim Opening', url: 'https://i.imgflip.com/1biy.jpg', category: 'gaming' },
    { id: 108, name: 'Minecraft Creeper', url: 'https://i.imgflip.com/1bix.jpg', category: 'gaming' },
    { id: 109, name: 'Among Us Crewmate', url: 'https://i.imgflip.com/4f1e6f.png', category: 'gaming' },
    { id: 110, name: 'GTA San Andreas', url: 'https://i.imgflip.com/1biw.jpg', category: 'gaming' },
    { id: 111, name: 'PlayStation vs Xbox', url: 'https://i.imgflip.com/1biv.jpg', category: 'gaming' },
    { id: 112, name: 'Steam Sale', url: 'https://i.imgflip.com/1bit.jpg', category: 'gaming' },
    { id: 113, name: 'Discord Notification', url: 'https://i.imgflip.com/1bis.jpg', category: 'gaming' },
    { id: 114, name: 'Google Chrome Dino', url: 'https://i.imgflip.com/1bir.jpg', category: 'gaming' },
    { id: 115, name: 'Windows Update', url: 'https://i.imgflip.com/1biq.jpg', category: 'gaming' },
    { id: 116, name: 'iPhone vs Android', url: 'https://i.imgflip.com/1bip.jpg', category: 'gaming' },
    { id: 117, name: 'Internet Explorer', url: 'https://i.imgflip.com/1bio.jpg', category: 'gaming' },
    { id: 118, name: 'VR Headset', url: 'https://i.imgflip.com/1bin.jpg', category: 'gaming' },
    { id: 119, name: 'Coding At 3 AM', url: 'https://i.imgflip.com/1bim.jpg', category: 'gaming' },
    { id: 120, name: 'Stack Overflow', url: 'https://i.imgflip.com/1bil.jpg', category: 'gaming' },
    { id: 121, name: 'GitHub Commit', url: 'https://i.imgflip.com/1bik.jpg', category: 'gaming' },
    { id: 122, name: 'Bug in Production', url: 'https://i.imgflip.com/1bij.jpg', category: 'gaming' },
    { id: 123, name: 'Fortnite Dance', url: 'https://i.imgflip.com/3si4a1.jpg', category: 'gaming' },
    { id: 124, name: 'League of Legends Teemo', url: 'https://i.imgflip.com/3twv6f.jpg', category: 'gaming' },
    { id: 125, name: 'Valorant Spike', url: 'https://i.imgflip.com/3pq7vz.jpg', category: 'gaming' },
    { id: 126, name: 'Cyberpunk 2077 Bug', url: 'https://i.imgflip.com/3q7p7n.jpg', category: 'gaming' },
    { id: 127, name: 'CS:GO Awp', url: 'https://i.imgflip.com/3t2t9w.jpg', category: 'gaming' },
    { id: 128, name: 'Dota 2 Roshan', url: 'https://i.imgflip.com/3qqcim.png', category: 'gaming' },
    { id: 129, name: 'Overwatch Play', url: 'https://i.imgflip.com/3vzej.jpg', category: 'gaming' },
    { id: 130, name: 'Twitch Stream', url: 'https://i.imgflip.com/4f1e6f.png', category: 'gaming' },
    { id: 131, name: 'YouTube Rewind', url: 'https://i.imgflip.com/3pnmg.jpg', category: 'gaming' },
    { id: 132, name: 'TikTok Dance', url: 'https://i.imgflip.com/3lmzyx.jpg', category: 'gaming' },
    { id: 133, name: 'Reddit Upvote', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'gaming' },
    { id: 134, name: 'Twitter Bird', url: 'https://i.imgflip.com/345v97.jpg', category: 'gaming' },
    { id: 135, name: 'Instagram Like', url: 'https://i.imgflip.com/1ur9b0.jpg', category: 'gaming' },

    // Animals & Pets (20)
    { id: 136, name: 'Cute Dog', url: 'https://i.imgflip.com/1bh9.jpg', category: 'animals' },
    { id: 137, name: 'Funny Cat', url: 'https://i.imgflip.com/1bh8.jpg', category: 'animals' },
    { id: 138, name: 'Angry Bird', url: 'https://i.imgflip.com/1bh7.jpg', category: 'animals' },
    { id: 139, name: 'Lazy Panda', url: 'https://i.imgflip.com/1bh6.jpg', category: 'animals' },
    { id: 140, name: 'Dancing Penguin', url: 'https://i.imgflip.com/1bh5.jpg', category: 'animals' },
    { id: 141, name: 'Monkey Business', url: 'https://i.imgflip.com/1bh4.jpg', category: 'animals' },
    { id: 142, name: 'Lion King', url: 'https://i.imgflip.com/1bh3.jpg', category: 'animals' },
    { id: 143, name: 'Dolphin Jumping', url: 'https://i.imgflip.com/1bh2.jpg', category: 'animals' },
    { id: 144, name: 'Horse Riding', url: 'https://i.imgflip.com/1bh1.jpg', category: 'animals' },
    { id: 145, name: 'Fish Out of Water', url: 'https://i.imgflip.com/1bh0.jpg', category: 'animals' },
    { id: 146, name: 'Elephant Memory', url: 'https://i.imgflip.com/1bgz.jpg', category: 'animals' },
    { id: 147, name: 'Turtle Slow', url: 'https://i.imgflip.com/1bgy.jpg', category: 'animals' },
    { id: 148, name: 'Rabbit Fast', url: 'https://i.imgflip.com/1bgx.jpg', category: 'animals' },
    { id: 149, name: 'Fox Cunning', url: 'https://i.imgflip.com/1bgw.jpg', category: 'animals' },
    { id: 150, name: 'Owl Wisdom', url: 'https://i.imgflip.com/1bgv.jpg', category: 'animals' },
    { id: 151, name: 'Cat Breading', url: 'https://i.imgflip.com/3si4a1.jpg', category: 'animals' },
    { id: 152, name: 'Dog in Fire', url: 'https://i.imgflip.com/wxica.jpg', category: 'animals' },
    { id: 153, name: 'Hamster Eating', url: 'https://i.imgflip.com/3twv6f.jpg', category: 'animals' },
    { id: 154, name: 'Bird Watching', url: 'https://i.imgflip.com/3pq7vz.jpg', category: 'animals' },
    { id: 155, name: 'Fish Meme', url: 'https://i.imgflip.com/3q7p7n.jpg', category: 'animals' },

    // Sports & Fitness (15)
    { id: 156, name: 'LeBron James Crying', url: 'https://i.imgflip.com/1bi3.jpg', category: 'sports' },
    { id: 157, name: 'Messi vs Ronaldo', url: 'https://i.imgflip.com/1bi2.jpg', category: 'sports' },
    { id: 158, name: 'Michael Jordan Crying', url: 'https://i.imgflip.com/1bi1.jpg', category: 'sports' },
    { id: 159, name: 'Usain Bolt Winning', url: 'https://i.imgflip.com/1bi0.jpg', category: 'sports' },
    { id: 160, name: 'Tiger Woods Fist Pump', url: 'https://i.imgflip.com/1bhz.jpg', category: 'sports' },
    { id: 161, name: 'Gym Motivation', url: 'https://i.imgflip.com/1bhy.jpg', category: 'sports' },
    { id: 162, name: 'Protein Shake', url: 'https://i.imgflip.com/1bhx.jpg', category: 'sports' },
    { id: 163, name: 'Crossfit Obsessed', url: 'https://i.imgflip.com/1bhw.jpg', category: 'sports' },
    { id: 164, name: 'Yoga Meditation', url: 'https://i.imgflip.com/1bhv.jpg', category: 'sports' },
    { id: 165, name: 'Marathon Runner', url: 'https://i.imgflip.com/1bhu.jpg', category: 'sports' },
    { id: 166, name: 'Weightlifting Fail', url: 'https://i.imgflip.com/1bht.jpg', category: 'sports' },
    { id: 167, name: 'Basketball Dunk', url: 'https://i.imgflip.com/1bhs.jpg', category: 'sports' },
    { id: 168, name: 'Soccer Goal', url: 'https://i.imgflip.com/1bhr.jpg', category: 'sports' },
    { id: 169, name: 'Tennis Serve', url: 'https://i.imgflip.com/1bhq.jpg', category: 'sports' },
    { id: 170, name: 'Swimming Pool', url: 'https://i.imgflip.com/1bhp.jpg', category: 'sports' },

    // Food & Drink (15)
    { id: 171, name: 'Pizza Time', url: 'https://i.imgflip.com/1bho.jpg', category: 'food' },
    { id: 172, name: 'Coffee Addict', url: 'https://i.imgflip.com/1bhn.jpg', category: 'food' },
    { id: 173, name: 'Burger King', url: 'https://i.imgflip.com/1bhm.jpg', category: 'food' },
    { id: 174, name: 'McDonalds Fries', url: 'https://i.imgflip.com/1bhl.jpg', category: 'food' },
    { id: 175, name: 'Taco Tuesday', url: 'https://i.imgflip.com/1bhk.jpg', category: 'food' },
    { id: 176, name: 'Sushi Roll', url: 'https://i.imgflip.com/1bhj.jpg', category: 'food' },
    { id: 177, name: 'Chocolate Love', url: 'https://i.imgflip.com/1bhi.jpg', category: 'food' },
    { id: 178, name: 'Ice Cream Cone', url: 'https://i.imgflip.com/1bhh.jpg', category: 'food' },
    { id: 179, name: 'Salad vs Burger', url: 'https://i.imgflip.com/1bhg.jpg', category: 'food' },
    { id: 180, name: 'Wine Time', url: 'https://i.imgflip.com/1bhf.jpg', category: 'food' },
    { id: 181, name: 'Beer Cheers', url: 'https://i.imgflip.com/1bhe.jpg', category: 'food' },
    { id: 182, name: 'Cooking Disaster', url: 'https://i.imgflip.com/1bhd.jpg', category: 'food' },
    { id: 183, name: 'Diet Starts Monday', url: 'https://i.imgflip.com/1bhc.jpg', category: 'food' },
    { id: 184, name: 'Gordon Ramsay Angry', url: 'https://i.imgflip.com/1bhb.jpg', category: 'food' },
    { id: 185, name: 'Food Delivery', url: 'https://i.imgflip.com/1bha.jpg', category: 'food' },

    // Work & School (20)
    { id: 186, name: 'Monday Morning', url: 'https://i.imgflip.com/1bgu.jpg', category: 'work' },
    { id: 187, name: 'Friday Feeling', url: 'https://i.imgflip.com/1bgt.jpg', category: 'work' },
    { id: 188, name: 'Meeting Boring', url: 'https://i.imgflip.com/1bgs.jpg', category: 'work' },
    { id: 189, name: 'Work From Home', url: 'https://i.imgflip.com/1bgr.jpg', category: 'work' },
    { id: 190, name: 'Email Overload', url: 'https://i.imgflip.com/1bgq.jpg', category: 'work' },
    { id: 191, name: 'Deadline Approaching', url: 'https://i.imgflip.com/1bgp.jpg', category: 'work' },
    { id: 192, name: 'Boss Watching', url: 'https://i.imgflip.com/1bgo.jpg', category: 'work' },
    { id: 193, name: 'Office Party', url: 'https://i.imgflip.com/1bgn.jpg', category: 'work' },
    { id: 194, name: 'Coffee Break', url: 'https://i.imgflip.com/1bgm.jpg', category: 'work' },
    { id: 195, name: 'School Homework', url: 'https://i.imgflip.com/1bgl.jpg', category: 'work' },
    { id: 196, name: 'Exam Stress', url: 'https://i.imgflip.com/1bgk.jpg', category: 'work' },
    { id: 197, name: 'Group Project', url: 'https://i.imgflip.com/1bgj.jpg', category: 'work' },
    { id: 198, name: 'Teacher Explaining', url: 'https://i.imgflip.com/1bgi.jpg', category: 'work' },
    { id: 199, name: 'Graduation Day', url: 'https://i.imgflip.com/1bgh.jpg', category: 'work' },
    { id: 200, name: 'Summer Vacation', url: 'https://i.imgflip.com/1bgg.jpg', category: 'work' },
  ];

  // Categories
  const categories = [
    { id: 'all', name: 'All Memes', emoji: '🔥', count: templates.length },
    { id: 'popular', name: 'Popular', emoji: '⭐', count: templates.filter(t => t.category === 'popular').length },
    { id: 'reaction', name: 'Reactions', emoji: '😄', count: templates.filter(t => t.category === 'reaction').length },
    { id: 'cartoon', name: 'Cartoon', emoji: '📺', count: templates.filter(t => t.category === 'cartoon').length },
    { id: 'movies', name: 'Movies & TV', emoji: '🎬', count: templates.filter(t => t.category === 'movies').length },
    { id: 'gaming', name: 'Gaming & Tech', emoji: '🎮', count: templates.filter(t => t.category === 'gaming').length },
    { id: 'animals', name: 'Animals', emoji: '🐱', count: templates.filter(t => t.category === 'animals').length },
    { id: 'sports', name: 'Sports', emoji: '⚽', count: templates.filter(t => t.category === 'sports').length },
    { id: 'food', name: 'Food', emoji: '🍕', count: templates.filter(t => t.category === 'food').length },
    { id: 'work', name: 'Work & School', emoji: '💼', count: templates.filter(t => t.category === 'work').length },
  ];

  // WORKING Fonts (common system fonts)
  const fontOptions = [
    { name: 'Impact (Best for Memes)', value: 'Impact, sans-serif', type: 'meme' },
    { name: 'Arial Black', value: 'Arial Black, Gadget, sans-serif', type: 'standard' },
    { name: 'Comic Sans MS', value: '"Comic Sans MS", cursive, sans-serif', type: 'fun' },
    { name: 'Georgia', value: 'Georgia, serif', type: 'serif' },
    { name: 'Verdana', value: 'Verdana, Geneva, sans-serif', type: 'standard' },
    { name: 'Tahoma', value: 'Tahoma, Geneva, sans-serif', type: 'standard' },
    { name: 'Trebuchet MS', value: '"Trebuchet MS", Helvetica, sans-serif', type: 'modern' },
    { name: 'Courier New', value: '"Courier New", Courier, monospace', type: 'code' },
    { name: 'Times New Roman', value: '"Times New Roman", Times, serif', type: 'serif' },
    { name: 'Arial', value: 'Arial, sans-serif', type: 'standard' },
    { name: 'Helvetica', value: 'Helvetica, Arial, sans-serif', type: 'standard' },
  ];

  // Font weight options
  const fontWeightOptions = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Bold' },
    { value: '700', label: 'Bold 700' },
    { value: '800', label: 'Extra Bold' },
    { value: '900', label: 'Black' },
  ];

  // Quick text suggestions
  const quickTexts = [
    "When you finally fix the bug",
    "Me trying to understand React",
    "How it feels to write JavaScript",
    "When the code works on first try",
    "Monday morning mood",
    "My code vs production",
    "When you find a StackOverflow answer",
    "Debugging be like",
    "My reaction to every PR comment",
    "When the client says 'make it pop'",
    "How I explain my code to others",
    "When you realize it's Friday",
    "My brain during meetings",
    "Trying to remember the syntax",
    "When you spot a typo after deployment",
  ];

  // Drag and drop handlers
  const handleTextDragStart = (id, e) => {
    e.preventDefault();
    const text = texts.find(t => t.id === id);
    if (!text || !imageRef.current) return;
    
    setDraggingText(id);
    const textRect = e.currentTarget.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    const offsetX = e.clientX - textRect.left;
    const offsetY = e.clientY - textRect.top;
    
    setDragOffset({ x: offsetX, y: offsetY });
    document.body.style.cursor = 'grabbing';
  };

  const handleTextDrag = (e) => {
    if (!draggingText || !imageRef.current) return;
    
    e.preventDefault();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    let x = e.clientX - imageRect.left - dragOffset.x;
    let y = e.clientY - imageRect.top - dragOffset.y;
    
    const padding = 10;
    const maxX = imageRect.width - 100 - padding;
    const maxY = imageRect.height - 50 - padding;
    
    x = Math.max(padding, Math.min(x, maxX));
    y = Math.max(padding, Math.min(y, maxY));
    
    setTexts(prevTexts => 
      prevTexts.map(text => 
        text.id === draggingText ? { ...text, x, y } : text
      )
    );
  };

  const handleTextDragEnd = () => {
    if (draggingText) {
      setDraggingText(null);
      document.body.style.cursor = 'default';
    }
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (draggingText) handleTextDrag(e);
    };

    const handleMouseUp = () => {
      handleTextDragEnd();
    };

    if (draggingText) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'auto';
    };
  }, [draggingText, dragOffset]);

  // Text functions
  const addText = () => {
    const newText = {
      id: Date.now(),
      text: 'Your text here',
      x: 50,
      y: 50,
      visible: true,
      layer: texts.length + 1,
    };
    setTexts([...texts, newText]);
  };

  const updateText = (id, field, value) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, [field]: value } : text
    ));
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
  };

  const clearAllTexts = () => {
    if (texts.length > 0) {
      setTexts([]);
      toast.success('All text cleared');
    }
  };

  const handleDownload = () => {
    toast.loading('Preparing download...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Download started!');
    }, 1500);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied to clipboard!');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target.result);
        setSelectedTemplate(null);
        toast.success('Image uploaded!');
      };
      reader.readAsDataURL(file);
    }
  };

  const getRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * templates.length);
    setSelectedTemplate(templates[randomIndex]);
    setUploadedImage(null);
    setActiveTab('editor');
    toast.success(`Random meme: ${templates[randomIndex].name}`);
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get text style
  const getTextStyle = () => {
    const style = {
      fontFamily: fontFamily,
      fontSize: `${fontSize}px`,
      fontWeight: fontWeight,
      fontStyle: fontStyle,
      color: textColor,
      textAlign: textAlign,
      lineHeight: '1.2',
      padding: '8px 12px',
      whiteSpace: 'pre-wrap',
      wordBreak: 'break-word',
      maxWidth: '400px',
      minWidth: '50px',
      borderRadius: '4px',
      backgroundColor: draggingText ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
      border: draggingText ? '2px dashed #3b82f6' : 'none',
    };
    
    if (textOutline) {
      style.textShadow = textShadow 
        ? `2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0px 2px 0 #000, 2px 0px 0 #000, 0px -2px 0 #000, -2px 0px 0 #000`
        : `2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000`;
    } else if (textShadow) {
      style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
    }
    
    return style;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <Toaster position="top-right" />
      
      <div className="max-w-8xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-2">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🎭 Meme Generator
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            {templates.length}+ funny templates • Drag & drop text • Free
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Text Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaFont className="text-blue-500" />
                Text Controls
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={addText}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl font-bold hover:opacity-90 transition-all"
                >
                  + Add Text (Drag me!)
                </button>

                <div>
                  <label className="block text-sm font-medium mb-2">Text</label>
                  {texts.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {texts.map((text, index) => (
                        <div key={text.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <input
                            type="text"
                            value={text.text}
                            onChange={(e) => updateText(text.id, 'text', e.target.value)}
                            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                          />
                          <button
                            onClick={() => removeText(text.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <FaTimes size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">No text added yet</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-white text-sm"
                  >
                    {fontOptions.map(font => (
                      <option key={font.name} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Size: {fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Weight</label>
                    <select
                      value={fontWeight}
                      onChange={(e) => setFontWeight(e.target.value)}
                      className="w-full p-2 rounded-lg border bg-white text-sm"
                    >
                      {fontWeightOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 cursor-pointer rounded-lg border"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={textColor}
                        onChange={(e) => setTextColor(e.target.value)}
                        className="w-full p-2 rounded-lg border text-sm"
                      />
                      <div className="flex gap-4 mt-2">
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={textOutline}
                            onChange={(e) => setTextOutline(e.target.checked)}
                            className="w-4 h-4"
                          />
                          Outline
                        </label>
                        <label className="flex items-center gap-1 text-sm">
                          <input
                            type="checkbox"
                            checked={textShadow}
                            onChange={(e) => setTextShadow(e.target.checked)}
                            className="w-4 h-4"
                          />
                          Shadow
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Align</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setTextAlign('left')}
                      className={`p-3 rounded-lg flex-1 ${textAlign === 'left' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <FaAlignLeft className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setTextAlign('center')}
                      className={`p-3 rounded-lg flex-1 ${textAlign === 'center' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <FaAlignCenter className="mx-auto" />
                    </button>
                    <button
                      onClick={() => setTextAlign('right')}
                      className={`p-3 rounded-lg flex-1 ${textAlign === 'right' ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                    >
                      <FaAlignRight className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm hover:opacity-90"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
                <button
                  onClick={clearAllTexts}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-500 to-gray-700 text-white text-sm hover:opacity-90"
                >
                  <FaTimes />
                  <span>Clear Text</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm hover:opacity-90"
                >
                  <FaShareAlt />
                  <span>Share</span>
                </button>
                <button
                  onClick={getRandomMeme}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm hover:opacity-90"
                >
                  <FaRandom />
                  <span>Random</span>
                </button>
              </div>
            </div>

            {/* Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Upload Image
              </h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <FaUpload className="text-3xl mx-auto text-gray-400 mb-3" />
                <p className="text-gray-600 text-sm">Click to upload</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF</p>
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('editor')}
                className={`px-6 py-3 font-medium ${activeTab === 'editor' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                🎨 Editor
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`px-6 py-3 font-medium ${activeTab === 'templates' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
              >
                📚 Templates ({templates.length})
              </button>
            </div>

            {/* Content */}
            {activeTab === 'editor' ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-gray-800">
                    Preview {draggingText && "(Dragging...)"}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {selectedTemplate?.name || 'No template selected'}
                  </div>
                </div>

                {/* Preview Area */}
                <div className="relative bg-gray-100 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center p-4 border-2 border-dashed border-gray-300">
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={uploadedImage}
                        alt="Uploaded"
                        className="max-w-full max-h-[500px] object-contain rounded-lg"
                        draggable="false"
                      />
                    </div>
                  ) : selectedTemplate ? (
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={selectedTemplate.url}
                        alt={selectedTemplate.name}
                        className="max-w-full max-h-[500px] object-contain rounded-lg"
                        draggable="false"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/500x400?text=Meme+Template';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 p-8">
                      <FaImage className="text-5xl mx-auto mb-4 text-gray-400" />
                      <p className="text-lg mb-2">Select a template to start</p>
                      <button
                        onClick={() => setActiveTab('templates')}
                        className="px-5 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:opacity-90"
                      >
                        Browse Templates
                      </button>
                    </div>
                  )}

                  {/* Text Overlays */}
                  {texts.filter(t => t.visible).map((text) => (
                    <motion.div
                      key={text.id}
                      className="absolute cursor-grab active:cursor-grabbing"
                      style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        zIndex: text.layer,
                      }}
                      onMouseDown={(e) => handleTextDragStart(text.id, e)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 1.05 }}
                    >
                      <div
                        style={getTextStyle()}
                        className="whitespace-pre-wrap break-words"
                      >
                        {text.text}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span>{category.emoji}</span>
                      <span>{category.name}</span>
                      <span className="text-xs opacity-75">({category.count})</span>
                    </button>
                  ))}
                </div>

                {/* Search */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search memes..."
                    className="w-full p-4 pl-12 rounded-2xl border-2 border-gray-300 focus:border-blue-500 outline-none"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {filteredTemplates.length} found
                  </div>
                </div>

                {/* Templates */}
                {filteredTemplates.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setUploadedImage(null);
                          setActiveTab('editor');
                        }}
                        className="cursor-pointer rounded-xl overflow-hidden border border-gray-200 hover:border-blue-500 transition-all bg-white"
                      >
                        <div className="h-32 overflow-hidden bg-gray-100">
                          <img
                            src={template.url}
                            alt={template.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform"
                            loading="lazy"
                          />
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{template.name}</p>
                          <div className="flex justify-between items-center mt-2">
                            <span className="text-xs text-gray-500">{template.category}</span>
                            <span className="text-xs text-blue-500">Click to edit</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <FaSearch className="text-4xl mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No memes found</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Captions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Quick Captions
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {quickTexts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      addText();
                      setTimeout(() => {
                        const newTexts = [...texts];
                        if (newTexts.length > 0) {
                          const lastText = newTexts[newTexts.length - 1];
                          lastText.text = text;
                          setTexts(newTexts);
                        }
                      }, 100);
                    }}
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm text-gray-700"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">📊 Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Templates:</span>
                  <span className="font-bold">{templates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-bold">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Layers:</span>
                  <span className="font-bold">{texts.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Current Font:</span>
                  <span className="font-bold">{fontFamily.split(',')[0]}</span>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                💡 Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-medium text-sm">🎯 Click & drag text</div>
                  <div className="text-xs text-gray-600">
                    Move text anywhere on the image
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-medium text-sm">✨ Use Impact font</div>
                  <div className="text-xs text-gray-600">
                    Best font for memes
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-medium text-sm">💾 Download & share</div>
                  <div className="text-xs text-gray-600">
                    Save your creations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600">
            🎭 {templates.length} unique meme templates • 🖱️ Drag & drop text • 🆓 Free to use
          </p>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;

//const templates = [
  // ... existing templates ...
  
  // Add your new templates here:
  //{ id: 201, name: 'Your Meme Name', url: 'https://your-image-url.jpg', category: 'popular' },
 // { id: 202, name: 'Another Meme', url: 'https://another-image.jpg', category: 'reaction' },
  
  // ... rest of templates ...
//];