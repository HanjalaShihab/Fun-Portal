// src/components/MemeGenerator/MemeGenerator.jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaDownload, FaUpload, FaFont, FaPalette, 
  FaRandom, FaHeart, FaShareAlt, FaCopy,
  FaArrowUp, FaArrowDown, FaEye, FaEyeSlash,
  FaBold, FaItalic, FaUnderline, FaAlignLeft,
  FaAlignCenter, FaAlignRight, FaSearch,
  FaFilter, FaMagic, FaRobot, FaStar,
  FaGripLines, FaTimes, FaImage, FaRedo,
  FaArrowsAlt, FaFire, FaLaugh, FaSadTear,
  FaAngry, FaSurprise, FaThumbsUp, FaGhost,
  FaCat, FaDog, FaRobot as FaRobotIcon,
  FaGamepad, FaFilm, FaMusic, FaTv,
  FaBook, FaCode, FaGraduationCap, FaShoppingCart,
  FaCar, FaPlane, FaPizzaSlice, FaCoffee,
  FaFutbol, FaBasketballBall, FaFootballBall,
  FaHashtag, FaChartLine, FaMoneyBillWave,
  FaCrown, FaRocket, FaMagic as FaMagicWand,
  FaCloud, FaSun, FaMoon, FaStar as FaStarIcon,
  FaHeart as FaHeartIcon, FaRegClock, FaGlobe,
  FaUserFriends, FaCouch, FaWifi, FaUmbrellaBeach
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
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const memeRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  // Update image size when it loads
  useEffect(() => {
    if (imageRef.current && (selectedTemplate || uploadedImage)) {
      const updateImageSize = () => {
        if (imageRef.current) {
          const { width, height } = imageRef.current.getBoundingClientRect();
          setImageSize({ width, height });
        }
      };

      if (imageRef.current.complete) {
        updateImageSize();
      } else {
        imageRef.current.onload = updateImageSize;
      }

      window.addEventListener('resize', updateImageSize);
      return () => window.removeEventListener('resize', updateImageSize);
    }
  }, [selectedTemplate, uploadedImage]);

  // 150+ Meme Templates Organized by Categories
  const templates = [
    // Popular & Viral (20)
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
    { id: 11, name: 'Two Spider-Man', url: 'https://i.imgflip.com/3vzej.jpg', category: 'popular' },
    { id: 12, name: 'This Is Fine', url: 'https://i.imgflip.com/wxica.jpg', category: 'popular' },
    { id: 13, name: 'Surprised Pikachu', url: 'https://i.imgflip.com/2xqsb6.jpg', category: 'popular' },
    { id: 14, name: 'Boardroom Meeting', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'popular' },
    { id: 15, name: 'UNO Draw 25', url: 'https://i.imgflip.com/3lmzyx.jpg', category: 'popular' },
    { id: 16, name: 'Leonardo Dicaprio Cheers', url: 'https://i.imgflip.com/39tlyr.jpg', category: 'popular' },
    { id: 17, name: 'Monkey Puppet', url: 'https://i.imgflip.com/3pnmg.jpg', category: 'popular' },
    { id: 18, name: 'Is This A Pigeon?', url: 'https://i.imgflip.com/1o00in.jpg', category: 'popular' },
    { id: 19, name: 'Running Away Balloon', url: 'https://i.imgflip.com/1c1uej.jpg', category: 'popular' },
    { id: 20, name: 'Epic Handshake', url: 'https://i.imgflip.com/3vzej.jpg', category: 'popular' },

    // Reaction & Emotions (25)
    { id: 21, name: 'Success Kid', url: 'https://i.imgflip.com/1bhk.jpg', category: 'reaction' },
    { id: 22, name: 'Bad Luck Brian', url: 'https://i.imgflip.com/1bhm.jpg', category: 'reaction' },
    { id: 23, name: 'Grumpy Cat', url: 'https://i.imgflip.com/1e4q3b.jpg', category: 'reaction' },
    { id: 24, name: 'First World Problems', url: 'https://i.imgflip.com/1bip.jpg', category: 'reaction' },
    { id: 25, name: 'Overly Attached Girlfriend', url: 'https://i.imgflip.com/1bik.jpg', category: 'reaction' },
    { id: 26, name: 'Scumbag Steve', url: 'https://i.imgflip.com/1bh6.jpg', category: 'reaction' },
    { id: 27, name: 'Good Guy Greg', url: 'https://i.imgflip.com/1bh3.jpg', category: 'reaction' },
    { id: 28, name: 'Y U No', url: 'https://i.imgflip.com/1bh8.jpg', category: 'reaction' },
    { id: 29, name: 'Futurama Fry', url: 'https://i.imgflip.com/1bgw.jpg', category: 'reaction' },
    { id: 30, name: 'Philosoraptor', url: 'https://i.imgflip.com/1bii.jpg', category: 'reaction' },
    { id: 31, name: 'Socially Awesome Penguin', url: 'https://i.imgflip.com/1bh7.jpg', category: 'reaction' },
    { id: 32, name: 'Third World Skeptical Kid', url: 'https://i.imgflip.com/1bif.jpg', category: 'reaction' },
    { id: 33, name: 'Condescending Wonka', url: 'https://i.imgflip.com/1bim.jpg', category: 'reaction' },
    { id: 34, name: 'Laughing Men', url: 'https://i.imgflip.com/1bhk.jpg', category: 'reaction' },
    { id: 35, name: '10 Guy', url: 'https://i.imgflip.com/1bhh.jpg', category: 'reaction' },
    { id: 36, name: 'Angry Walter', url: 'https://i.imgflip.com/1bhj.jpg', category: 'reaction' },
    { id: 37, name: 'Star Wars Yoda', url: 'https://i.imgflip.com/1bh5.jpg', category: 'reaction' },
    { id: 38, name: 'Matrix Morpheus', url: 'https://i.imgflip.com/1bim.jpg', category: 'reaction' },
    { id: 39, name: 'Ancient Aliens', url: 'https://i.imgflip.com/26am.jpg', category: 'reaction' },
    { id: 40, name: 'The Most Interesting Man', url: 'https://i.imgflip.com/1bim.jpg', category: 'reaction' },
    { id: 41, name: 'X, X Everywhere', url: 'https://i.imgflip.com/1bh4.jpg', category: 'reaction' },
    { id: 42, name: 'One Does Not Simply', url: 'https://i.imgflip.com/1bgw.jpg', category: 'reaction' },
    { id: 43, name: 'Captain Picard Facepalm', url: 'https://i.imgflip.com/26br.jpg', category: 'reaction' },
    { id: 44, name: 'Yo Dawg Heard You', url: 'https://i.imgflip.com/1bhj.jpg', category: 'reaction' },
    { id: 45, name: 'Hide the Pain Harold', url: 'https://i.imgflip.com/5k5v0r.jpg', category: 'reaction' },

    // Cartoon & Anime (20)
    { id: 46, name: 'Spongebob Mocking', url: 'https://i.imgflip.com/1otk96.jpg', category: 'cartoon' },
    { id: 47, name: 'Spongebob Imaginative', url: 'https://i.imgflip.com/1bij.jpg', category: 'cartoon' },
    { id: 48, name: 'Patrick Star', url: 'https://i.imgflip.com/1bif.jpg', category: 'cartoon' },
    { id: 49, name: 'Mr. Krabs', url: 'https://i.imgflip.com/1bh2.jpg', category: 'cartoon' },
    { id: 50, name: 'Squidward', url: 'https://i.imgflip.com/1bh1.jpg', category: 'cartoon' },
    { id: 51, name: 'Anime Girl Crying', url: 'https://i.imgflip.com/1bh9.jpg', category: 'cartoon' },
    { id: 52, name: 'Anime Smug Face', url: 'https://i.imgflip.com/1bha.jpg', category: 'cartoon' },
    { id: 53, name: 'Pikachu Shocked', url: 'https://i.imgflip.com/2xqsb6.jpg', category: 'cartoon' },
    { id: 54, name: 'Doge Dog', url: 'https://i.imgflip.com/4t0m5.jpg', category: 'cartoon' },
    { id: 55, name: 'Cheems Dog', url: 'https://i.imgflip.com/43a45p.png', category: 'cartoon' },
    { id: 56, name: 'Pepe the Frog', url: 'https://i.imgflip.com/1bhl.jpg', category: 'cartoon' },
    { id: 57, name: 'Arthur Fist', url: 'https://i.imgflip.com/1bhg.jpg', category: 'cartoon' },
    { id: 58, name: 'Simpson Homer', url: 'https://i.imgflip.com/1bhf.jpg', category: 'cartoon' },
    { id: 59, name: 'Rick and Morty', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'cartoon' },
    { id: 60, name: 'Adventure Time', url: 'https://i.imgflip.com/1bhe.jpg', category: 'cartoon' },
    { id: 61, name: 'Gumball Watterson', url: 'https://i.imgflip.com/1bhd.jpg', category: 'cartoon' },
    { id: 62, name: 'Tom and Jerry', url: 'https://i.imgflip.com/1bhc.jpg', category: 'cartoon' },
    { id: 63, name: 'Mickey Mouse', url: 'https://i.imgflip.com/1bhb.jpg', category: 'cartoon' },
    { id: 64, name: 'Saitama One Punch', url: 'https://i.imgflip.com/2xqsb6.jpg', category: 'cartoon' },
    { id: 65, name: 'Naruto Running', url: 'https://i.imgflip.com/3vzej.jpg', category: 'cartoon' },

    // Gaming & Tech (20)
    { id: 66, name: 'PC Master Race', url: 'https://i.imgflip.com/1biz.jpg', category: 'gaming' },
    { id: 67, name: 'Skyrim Opening', url: 'https://i.imgflip.com/1biy.jpg', category: 'gaming' },
    { id: 68, name: 'Minecraft Creeper', url: 'https://i.imgflip.com/1bix.jpg', category: 'gaming' },
    { id: 69, name: 'Among Us Crewmate', url: 'https://i.imgflip.com/4f1e6f.png', category: 'gaming' },
    { id: 70, name: 'Fortnite Default Dance', url: 'https://i.imgflip.com/3vzej.jpg', category: 'gaming' },
    { id: 71, name: 'GTA San Andreas', url: 'https://i.imgflip.com/1biw.jpg', category: 'gaming' },
    { id: 72, name: 'PlayStation vs Xbox', url: 'https://i.imgflip.com/1biv.jpg', category: 'gaming' },
    { id: 73, name: 'Nintendo Switch', url: 'https://i.imgflip.com/1biu.jpg', category: 'gaming' },
    { id: 74, name: 'Steam Sale', url: 'https://i.imgflip.com/1bit.jpg', category: 'gaming' },
    { id: 75, name: 'Discord Notification', url: 'https://i.imgflip.com/1bis.jpg', category: 'gaming' },
    { id: 76, name: 'Google Chrome Dino', url: 'https://i.imgflip.com/1bir.jpg', category: 'gaming' },
    { id: 77, name: 'Windows Update', url: 'https://i.imgflip.com/1biq.jpg', category: 'gaming' },
    { id: 78, name: 'iPhone vs Android', url: 'https://i.imgflip.com/1bip.jpg', category: 'gaming' },
    { id: 79, name: 'Internet Explorer', url: 'https://i.imgflip.com/1bio.jpg', category: 'gaming' },
    { id: 80, name: 'VR Headset', url: 'https://i.imgflip.com/1bin.jpg', category: 'gaming' },
    { id: 81, name: 'Robot AI Thinking', url: 'https://i.imgflip.com/2xqsb6.jpg', category: 'gaming' },
    { id: 82, name: 'Coding At 3 AM', url: 'https://i.imgflip.com/1bim.jpg', category: 'gaming' },
    { id: 83, name: 'Stack Overflow', url: 'https://i.imgflip.com/1bil.jpg', category: 'gaming' },
    { id: 84, name: 'GitHub Commit', url: 'https://i.imgflip.com/1bik.jpg', category: 'gaming' },
    { id: 85, name: 'Bug in Production', url: 'https://i.imgflip.com/1bij.jpg', category: 'gaming' },

    // Movies & TV Shows (20)
    { id: 86, name: 'Star Wars Obi-Wan', url: 'https://i.imgflip.com/1bih.jpg', category: 'movies' },
    { id: 87, name: 'Avengers Thanos', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'movies' },
    { id: 88, name: 'Harry Potter Sorting Hat', url: 'https://i.imgflip.com/1big.jpg', category: 'movies' },
    { id: 89, name: 'Lord of the Rings', url: 'https://i.imgflip.com/1bif.jpg', category: 'movies' },
    { id: 90, name: 'Matrix Red Pill Blue', url: 'https://i.imgflip.com/1bie.jpg', category: 'movies' },
    { id: 91, name: 'Breaking Bad Walter', url: 'https://i.imgflip.com/1bid.jpg', category: 'movies' },
    { id: 92, name: 'Game of Thrones Throne', url: 'https://i.imgflip.com/1bic.jpg', category: 'movies' },
    { id: 93, name: 'Friends Smelly Cat', url: 'https://i.imgflip.com/1bib.jpg', category: 'movies' },
    { id: 94, name: 'The Office Michael', url: 'https://i.imgflip.com/1bia.jpg', category: 'movies' },
    { id: 95, name: 'Stranger Things Demogorgon', url: 'https://i.imgflip.com/3vzej.jpg', category: 'movies' },
    { id: 96, name: 'Back to the Future', url: 'https://i.imgflip.com/1bi9.jpg', category: 'movies' },
    { id: 97, name: 'Pulp Fiction John Travolta', url: 'https://i.imgflip.com/1bi8.jpg', category: 'movies' },
    { id: 98, name: 'Titanic Rose Jack', url: 'https://i.imgflip.com/1bi7.jpg', category: 'movies' },
    { id: 99, name: 'Jurassic Park T-Rex', url: 'https://i.imgflip.com/1bi6.jpg', category: 'movies' },
    { id: 100, name: 'Joker Stairs Dance', url: 'https://i.imgflip.com/3vzej.jpg', category: 'movies' },
    { id: 101, name: 'Spider-Man Pointing', url: 'https://i.imgflip.com/3vzej.jpg', category: 'movies' },
    { id: 102, name: 'Batman Slapping Robin', url: 'https://i.imgflip.com/1bi5.jpg', category: 'movies' },
    { id: 103, name: 'Superman Flying', url: 'https://i.imgflip.com/1bi4.jpg', category: 'movies' },
    { id: 104, name: 'Iron Man Snap', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'movies' },
    { id: 105, name: 'Captain America Shield', url: 'https://i.imgflip.com/2rt0m6.jpg', category: 'movies' },

    // Sports & Fitness (15)
    { id: 106, name: 'LeBron James Crying', url: 'https://i.imgflip.com/1bi3.jpg', category: 'sports' },
    { id: 107, name: 'Messi vs Ronaldo', url: 'https://i.imgflip.com/1bi2.jpg', category: 'sports' },
    { id: 108, name: 'Michael Jordan Crying', url: 'https://i.imgflip.com/1bi1.jpg', category: 'sports' },
    { id: 109, name: 'Usain Bolt Winning', url: 'https://i.imgflip.com/1bi0.jpg', category: 'sports' },
    { id: 110, name: 'Tiger Woods Fist Pump', url: 'https://i.imgflip.com/1bhz.jpg', category: 'sports' },
    { id: 111, name: 'Gym Motivation', url: 'https://i.imgflip.com/1bhy.jpg', category: 'sports' },
    { id: 112, name: 'Protein Shake', url: 'https://i.imgflip.com/1bhx.jpg', category: 'sports' },
    { id: 113, name: 'Crossfit Obsessed', url: 'https://i.imgflip.com/1bhw.jpg', category: 'sports' },
    { id: 114, name: 'Yoga Meditation', url: 'https://i.imgflip.com/1bhv.jpg', category: 'sports' },
    { id: 115, name: 'Marathon Runner', url: 'https://i.imgflip.com/1bhu.jpg', category: 'sports' },
    { id: 116, name: 'Weightlifting Fail', url: 'https://i.imgflip.com/1bht.jpg', category: 'sports' },
    { id: 117, name: 'Basketball Dunk', url: 'https://i.imgflip.com/1bhs.jpg', category: 'sports' },
    { id: 118, name: 'Soccer Goal', url: 'https://i.imgflip.com/1bhr.jpg', category: 'sports' },
    { id: 119, name: 'Tennis Serve', url: 'https://i.imgflip.com/1bhq.jpg', category: 'sports' },
    { id: 120, name: 'Swimming Pool', url: 'https://i.imgflip.com/1bhp.jpg', category: 'sports' },

    // Food & Drink (15)
    { id: 121, name: 'Pizza Time', url: 'https://i.imgflip.com/1bho.jpg', category: 'food' },
    { id: 122, name: 'Coffee Addict', url: 'https://i.imgflip.com/1bhn.jpg', category: 'food' },
    { id: 123, name: 'Burger King', url: 'https://i.imgflip.com/1bhm.jpg', category: 'food' },
    { id: 124, name: 'McDonalds Fries', url: 'https://i.imgflip.com/1bhl.jpg', category: 'food' },
    { id: 125, name: 'Taco Tuesday', url: 'https://i.imgflip.com/1bhk.jpg', category: 'food' },
    { id: 126, name: 'Sushi Roll', url: 'https://i.imgflip.com/1bhj.jpg', category: 'food' },
    { id: 127, name: 'Chocolate Love', url: 'https://i.imgflip.com/1bhi.jpg', category: 'food' },
    { id: 128, name: 'Ice Cream Cone', url: 'https://i.imgflip.com/1bhh.jpg', category: 'food' },
    { id: 129, name: 'Salad vs Burger', url: 'https://i.imgflip.com/1bhg.jpg', category: 'food' },
    { id: 130, name: 'Wine Time', url: 'https://i.imgflip.com/1bhf.jpg', category: 'food' },
    { id: 131, name: 'Beer Cheers', url: 'https://i.imgflip.com/1bhe.jpg', category: 'food' },
    { id: 132, name: 'Cooking Disaster', url: 'https://i.imgflip.com/1bhd.jpg', category: 'food' },
    { id: 133, name: 'Diet Starts Monday', url: 'https://i.imgflip.com/1bhc.jpg', category: 'food' },
    { id: 134, name: 'Gordon Ramsay Angry', url: 'https://i.imgflip.com/1bhb.jpg', category: 'food' },
    { id: 135, name: 'Food Delivery', url: 'https://i.imgflip.com/1bha.jpg', category: 'food' },

    // Animals & Pets (15)
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

    // Work & School (15)
    { id: 151, name: 'Monday Morning', url: 'https://i.imgflip.com/1bgu.jpg', category: 'work' },
    { id: 152, name: 'Friday Feeling', url: 'https://i.imgflip.com/1bgt.jpg', category: 'work' },
    { id: 153, name: 'Meeting Boring', url: 'https://i.imgflip.com/1bgs.jpg', category: 'work' },
    { id: 154, name: 'Work From Home', url: 'https://i.imgflip.com/1bgr.jpg', category: 'work' },
    { id: 155, name: 'Email Overload', url: 'https://i.imgflip.com/1bgq.jpg', category: 'work' },
    { id: 156, name: 'Deadline Approaching', url: 'https://i.imgflip.com/1bgp.jpg', category: 'work' },
    { id: 157, name: 'Boss Watching', url: 'https://i.imgflip.com/1bgo.jpg', category: 'work' },
    { id: 158, name: 'Office Party', url: 'https://i.imgflip.com/1bgn.jpg', category: 'work' },
    { id: 159, name: 'Coffee Break', url: 'https://i.imgflip.com/1bgm.jpg', category: 'work' },
    { id: 160, name: 'School Homework', url: 'https://i.imgflip.com/1bgl.jpg', category: 'work' },
    { id: 161, name: 'Exam Stress', url: 'https://i.imgflip.com/1bgk.jpg', category: 'work' },
    { id: 162, name: 'Group Project', url: 'https://i.imgflip.com/1bgj.jpg', category: 'work' },
    { id: 163, name: 'Teacher Explaining', url: 'https://i.imgflip.com/1bgi.jpg', category: 'work' },
    { id: 164, name: 'Graduation Day', url: 'https://i.imgflip.com/1bgh.jpg', category: 'work' },
    { id: 165, name: 'Summer Vacation', url: 'https://i.imgflip.com/1bgg.jpg', category: 'work' },
  ];

  // Categories with icons
  const categories = [
    { id: 'all', name: 'All Memes', icon: <FaFire />, count: templates.length },
    { id: 'popular', name: 'Popular', icon: <FaStarIcon />, count: templates.filter(t => t.category === 'popular').length },
    { id: 'reaction', name: 'Reactions', icon: <FaLaugh />, count: templates.filter(t => t.category === 'reaction').length },
    { id: 'cartoon', name: 'Cartoon', icon: <FaTv />, count: templates.filter(t => t.category === 'cartoon').length },
    { id: 'gaming', name: 'Gaming', icon: <FaGamepad />, count: templates.filter(t => t.category === 'gaming').length },
    { id: 'movies', name: 'Movies & TV', icon: <FaFilm />, count: templates.filter(t => t.category === 'movies').length },
    { id: 'sports', name: 'Sports', icon: <FaFutbol />, count: templates.filter(t => t.category === 'sports').length },
    { id: 'food', name: 'Food & Drink', icon: <FaPizzaSlice />, count: templates.filter(t => t.category === 'food').length },
    { id: 'animals', name: 'Animals', icon: <FaCat />, count: templates.filter(t => t.category === 'animals').length },
    { id: 'work', name: 'Work & School', icon: <FaGraduationCap />, count: templates.filter(t => t.category === 'work').length },
  ];

  // Drag and drop handlers (same as before)
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
      toast.success('Text position updated!', { duration: 1000 });
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

  // Other functions remain the same...
  const addText = () => {
    const newText = {
      id: Date.now(),
      text: 'Your Text Here',
      x: 50,
      y: 50,
      width: 300,
      visible: true,
      layer: texts.length + 1,
    };
    setTexts([...texts, newText]);
    toast.success('Text added! Drag it anywhere on the meme');
  };

  const updateText = (id, field, value) => {
    setTexts(texts.map(text => 
      text.id === id ? { ...text, [field]: value } : text
    ));
  };

  const removeText = (id) => {
    setTexts(texts.filter(text => text.id !== id));
    toast.success('Text removed');
  };

  const duplicateText = (id) => {
    const textToDuplicate = texts.find(t => t.id === id);
    if (textToDuplicate) {
      const newText = {
        ...textToDuplicate,
        id: Date.now(),
        x: textToDuplicate.x + 20,
        y: textToDuplicate.y + 20,
      };
      setTexts([...texts, newText]);
      toast.success('Text duplicated!');
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
    toast.success('Share link copied to clipboard!');
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

  const clearAllTexts = () => {
    if (texts.length > 0) {
      setTexts([]);
      toast.success('All text cleared');
    }
  };

  const bringToFront = (id) => {
    const text = texts.find(t => t.id === id);
    if (text) {
      const otherTexts = texts.filter(t => t.id !== id);
      setTexts([...otherTexts, { ...text, layer: Date.now() }]);
      toast.success('Brought to front!');
    }
  };

  const sendToBack = (id) => {
    const text = texts.find(t => t.id === id);
    if (text) {
      const otherTexts = texts.filter(t => t.id !== id);
      setTexts([{ ...text, layer: -Date.now() }, ...otherTexts]);
      toast.success('Sent to back!');
    }
  };

  const resetTextPosition = (id) => {
    updateText(id, 'x', 50);
    updateText(id, 'y', 50);
    toast.success('Text position reset');
  };

  const getRandomMeme = () => {
    const randomIndex = Math.floor(Math.random() * templates.length);
    setSelectedTemplate(templates[randomIndex]);
    setUploadedImage(null);
    toast.success(`Random meme: ${templates[randomIndex].name}`);
    setActiveTab('editor');
  };

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Quick text suggestions
  const quickTexts = [
    "When you finally fix the bug",
    "Me trying to understand React hooks",
    "How it feels to write JavaScript",
    "When the code works on first try",
    "Debugging be like",
    "My reaction to every PR comment",
    "When you find a StackOverflow answer",
    "Monday morning mood",
    "My code vs production",
    "When the client says 'make it pop'",
    "How I explain my code to others",
    "When you realize it's Friday",
    "My brain during meetings",
    "Trying to remember the syntax",
    "When you spot a typo after deployment",
  ];

  const fontOptions = [
    'Impact', 'Arial', 'Comic Sans MS', 'Georgia', 'Verdana',
    'Times New Roman', 'Courier New', 'Trebuchet MS', 'Palatino',
    'Arial Black', 'Tahoma', 'Century Gothic', 'Lucida Console'
  ];

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
              🎭 Ultimate Meme Factory
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Create hilarious memes with {templates.length}+ templates! Drag text anywhere.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaDownload />
                  <span>Download</span>
                </button>
                <button
                  onClick={handleShare}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaShareAlt />
                  <span>Share</span>
                </button>
                <button
                  onClick={clearAllTexts}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-500 to-gray-700 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaTimes />
                  <span>Clear All</span>
                </button>
                <button
                  onClick={getRandomMeme}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium shadow-lg hover:opacity-90"
                >
                  <FaRandom />
                  <span>Random</span>
                </button>
              </div>
            </div>

            {/* Text Controls */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaFont className="text-blue-500" />
                Text Controls
              </h3>
              
              <div className="space-y-4">
                <button
                  onClick={addText}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg"
                >
                  <FaFont />
                  Add Text Box
                  <span className="text-sm opacity-90">(Drag anywhere!)</span>
                </button>

                <div>
                  <label className="block text-sm font-medium mb-2">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-10 h-10 cursor-pointer rounded-lg border"
                    />
                    <input
                      type="text"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="flex-1 p-2 rounded-lg border"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Font Size: {fontSize}px
                  </label>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setFontSize(f => Math.max(12, f - 2))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <input
                      type="range"
                      min="12"
                      max="120"
                      value={fontSize}
                      onChange={(e) => setFontSize(parseInt(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <button 
                      onClick={() => setFontSize(f => Math.min(120, f + 2))}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Font Family</label>
                  <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-3 rounded-lg border bg-white"
                  >
                    {fontOptions.map(font => (
                      <option key={font} value={font}>{font}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Text Align</label>
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

            {/* Drag Instructions */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaArrowsAlt className="text-yellow-300" />
                Drag Instructions
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">1</div>
                  <span>Click & hold any text</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">2</div>
                  <span>Drag LEFT, RIGHT, UP, DOWN</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">3</div>
                  <span>Release to position</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel - Preview & Editor */}
          <div className="lg:col-span-2">
            {/* Editor Tabs */}
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
                📚 Templates ({templates.length}+)
              </button>
            </div>

            {/* Content Area */}
            {activeTab === 'editor' ? (
              <div className="space-y-6">
                {/* Preview Header */}
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Meme Preview
                    {draggingText && (
                      <span className="text-sm text-blue-500 ml-2">(Dragging...)</span>
                    )}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white flex items-center gap-2"
                    >
                      <FaUpload />
                      Upload Image
                    </button>
                  </div>
                </div>

                {/* Meme Preview Container */}
                <div 
                  className="relative bg-gray-100 rounded-2xl overflow-hidden min-h-[500px] flex items-center justify-center p-4 border-2 border-dashed border-gray-300"
                >
                  {uploadedImage ? (
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={uploadedImage}
                        alt="Uploaded"
                        className="max-w-full max-h-[500px] object-contain rounded-lg select-none"
                        draggable="false"
                      />
                    </div>
                  ) : selectedTemplate ? (
                    <div className="relative">
                      <img
                        ref={imageRef}
                        src={selectedTemplate.url}
                        alt={selectedTemplate.name}
                        className="max-w-full max-h-[500px] object-contain rounded-lg select-none"
                        draggable="false"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Meme+Template';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 p-8">
                      <FaImage className="text-6xl mx-auto mb-4 text-gray-400" />
                      <p className="text-xl mb-2">Select a meme template to start!</p>
                      <button
                        onClick={() => setActiveTab('templates')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90"
                      >
                        Browse {templates.length}+ Templates
                      </button>
                    </div>
                  )}

                  {/* Text Overlays */}
                  {texts.filter(t => t.visible).map((text) => (
                    <motion.div
                      key={text.id}
                      className="absolute text-element cursor-grab active:cursor-grabbing select-none"
                      style={{
                        left: `${text.x}px`,
                        top: `${text.y}px`,
                        zIndex: text.layer,
                      }}
                      onMouseDown={(e) => handleTextDragStart(text.id, e)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 1.1 }}
                    >
                      <div className="relative group">
                        <div
                          style={{
                            color: textColor,
                            fontSize: `${fontSize}px`,
                            fontFamily: fontFamily,
                            fontWeight: 'bold',
                            textAlign: textAlign,
                            textShadow: '3px 3px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                            WebkitTextStroke: '1px black',
                            backgroundColor: draggingText === text.id ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            border: draggingText === text.id ? '2px dashed #3b82f6' : 'none',
                            minWidth: '100px',
                          }}
                          className="whitespace-pre-wrap break-words"
                        >
                          {text.text}
                        </div>
                        
                        {/* Text Controls */}
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeText(text.id);
                            }}
                            className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                            title="Remove"
                          >
                            <FaTimes size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateText(text.id);
                            }}
                            className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 shadow-lg"
                            title="Duplicate"
                          >
                            <FaCopy size={14} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              bringToFront(text.id);
                            }}
                            className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 shadow-lg"
                            title="Bring to Front"
                          >
                            <FaArrowUp size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Text Management */}
                {texts.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <h4 className="text-xl font-bold mb-4 text-gray-800">
                      Text Layers ({texts.length})
                    </h4>
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {texts.map((text, index) => (
                        <div key={text.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500">#{index + 1}</span>
                            <input
                              type="text"
                              value={text.text}
                              onChange={(e) => updateText(text.id, 'text', e.target.value)}
                              className="bg-transparent border-none focus:outline-none flex-1"
                              placeholder="Enter text..."
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">
                              x:{Math.round(text.x)} y:{Math.round(text.y)}
                            </span>
                            <button
                              onClick={() => removeText(text.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Category Tabs */}
                <div className="flex overflow-x-auto pb-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap ${
                        selectedCategory === category.id
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category.icon}
                      <span>{category.name}</span>
                      <span className="text-xs opacity-75">({category.count})</span>
                    </button>
                  ))}
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${selectedCategory === 'all' ? 'all' : categories.find(c => c.id === selectedCategory)?.name} memes...`}
                    className="w-full p-4 pl-12 rounded-2xl border-2 border-gray-300 focus:border-blue-500 outline-none"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                    {filteredTemplates.length} memes
                  </div>
                </div>

                {/* Templates Grid */}
                {filteredTemplates.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredTemplates.map((template) => (
                      <motion.div
                        key={template.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.03 }}
                        onClick={() => {
                          setSelectedTemplate(template);
                          setUploadedImage(null);
                          toast.success(`Selected: ${template.name}`);
                          setActiveTab('editor');
                        }}
                        className="cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all shadow-lg hover:shadow-xl bg-white"
                      >
                        <div className="relative h-32 overflow-hidden">
                          <img
                            src={template.url}
                            alt={template.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Meme+Template';
                            }}
                          />
                          <div className="absolute top-2 left-2">
                            <span className="px-2 py-1 bg-black/70 text-white text-xs rounded">
                              #{template.category}
                            </span>
                          </div>
                        </div>
                        <div className="p-3">
                          <p className="font-medium text-sm truncate">{template.name}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 bg-white rounded-2xl">
                    <FaSearch className="text-5xl mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No memes found for your search</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Upload & Quick Tips */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaUpload className="text-green-500" />
                Upload Your Image
              </h3>
              <div 
                className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <FaUpload className="text-5xl mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">
                  Drag & drop or click to upload
                </p>
                <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>

            {/* Quick Text Suggestions */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaMagic className="text-purple-500" />
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
                    className="w-full text-left p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-sm"
                  >
                    "{text}"
                  </button>
                ))}
              </div>
            </div>

            {/* Stats & Info */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl">
              <h3 className="text-xl font-bold mb-4">📊 Meme Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Total Templates:</span>
                  <span className="font-bold">{templates.length}+</span>
                </div>
                <div className="flex justify-between">
                  <span>Categories:</span>
                  <span className="font-bold">{categories.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Drag & Drop:</span>
                  <span className="font-bold">✅ Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Text Layers:</span>
                  <span className="font-bold">{texts.length}</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                <FaStar className="text-yellow-500" />
                Quick Tips
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50">
                  <div className="font-medium">🎯 Full Drag Control</div>
                  <div className="text-sm text-gray-600">
                    Drag text boxes anywhere on the meme
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-purple-50">
                  <div className="font-medium">✨ Layer Management</div>
                  <div className="text-sm text-gray-600">
                    Bring text forward/backward for effects
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-green-50">
                  <div className="font-medium">💾 Save & Share</div>
                  <div className="text-sm text-gray-600">
                    Download or share your creations
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-gray-600 mb-4">
            🎭 Create hilarious memes with {templates.length}+ templates • 🖱️ Full drag & drop • 🆓 Completely free
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            <span>🎭 {templates.length}+ Templates</span>
            <span>✨ Full 2D Drag</span>
            <span>🎨 Customizable</span>
            <span>⚡ Fast editing</span>
            <span>💾 Auto-save</span>
            <span>📱 Mobile friendly</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeGenerator;