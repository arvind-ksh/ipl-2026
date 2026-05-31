import { useState, useMemo } from "react";

/* ============================================================
   DATA
   ============================================================ */
const TEAMS = {
  RCB:  { name: "Royal Challengers Bengaluru", short: "RCB",  primary: "#CC0000", secondary: "#FFD700", captain: "Rajat Patidar",  coach: "Andy Flower",       home: "M. Chinnaswamy Stadium, Bengaluru",          titles: 1 },
  CSK:  { name: "Chennai Super Kings",         short: "CSK",  primary: "#F5A623", secondary: "#005DA0", captain: "Ruturaj Gaikwad", coach: "Stephen Fleming",    home: "MA Chidambaram Stadium, Chennai",            titles: 5 },
  MI:   { name: "Mumbai Indians",              short: "MI",   primary: "#1A78C2", secondary: "#D4AF37", captain: "Hardik Pandya",   coach: "Mahela Jayawardene", home: "Wankhede Stadium, Mumbai",                   titles: 5 },
  KKR:  { name: "Kolkata Knight Riders",       short: "KKR",  primary: "#7B2FBE", secondary: "#F7D11E", captain: "Ajinkya Rahane",  coach: "Abhishek Nayar",    home: "Eden Gardens, Kolkata",                      titles: 3 },
  SRH:  { name: "SunRisers Hyderabad",         short: "SRH",  primary: "#FF6B00", secondary: "#1A1A1A", captain: "Pat Cummins",     coach: "Daniel Vettori",    home: "Rajiv Gandhi Intl. Cricket Stadium, Hyderabad", titles: 1 },
  DC:   { name: "Delhi Capitals",              short: "DC",   primary: "#0078BC", secondary: "#EF1B23", captain: "Axar Patel",      coach: "Hemang Badani",     home: "Arun Jaitley Stadium, Delhi",                titles: 0 },
  GT:   { name: "Gujarat Titans",              short: "GT",   primary: "#4A90D9", secondary: "#A2C8CA", captain: "Shubman Gill",    coach: "Ashish Nehra",      home: "Narendra Modi Stadium, Ahmedabad",           titles: 1 },
  RR:   { name: "Rajasthan Royals",            short: "RR",   primary: "#E91E8C", secondary: "#2B4999", captain: "Riyan Parag",     coach: "Kumar Sangakkara",  home: "Sawai Mansingh Stadium, Jaipur",             titles: 1 },
  PBKS: { name: "Punjab Kings",               short: "PBKS", primary: "#D9232E", secondary: "#A8A8A8", captain: "Shreyas Iyer",    coach: "Ricky Ponting",     home: "HPCA Stadium, Dharamshala",                  titles: 0 },
  LSG:  { name: "Lucknow Super Giants",        short: "LSG",  primary: "#A72056", secondary: "#FFCC00", captain: "Rishabh Pant",    coach: "Justin Langer",     home: "Ekana Cricket Stadium, Lucknow",             titles: 0 },
};

const SQUADS = {
  RCB:  { Batters: ["Rajat Patidar","Virat Kohli","Devdutt Padikkal","Phil Salt","Jitesh Sharma","Jordan Cox"], "All-Rounders": ["Krunal Pandya","Tim David","Romario Shepherd","Jacob Bethell","Venkatesh Iyer","Swapnil Singh","Vicky Ostwal","Mangesh Yadav"], Bowlers: ["Josh Hazlewood","Bhuvneshwar Kumar","Yash Dayal","Rasikh Dar","Suyash Sharma","Nuwan Thushara","Jacob Duffy","Abinandan Singh"] },
  CSK:  { Batters: ["Ruturaj Gaikwad","MS Dhoni","Sanju Samson","Dewald Brevis","Ayush Mhatre","Kartik Sharma","Sarfaraz Khan","Urvil Patel"], "All-Rounders": ["Shivam Dube","Jamie Overton","Matthew Short","Prashant Veer","Ramakrishna Ghosh","Aman Khan","Zak Foulkes"], Bowlers: ["Khaleel Ahmed","Noor Ahmad","Anshul Kamboj","Matt Henry","Spencer Johnson","Mukesh Choudhary","Shreyas Gopal","Rahul Chahar","Gurjapneet Singh","Akeal Hosein"] },
  MI:   { Batters: ["Rohit Sharma","Suryakumar Yadav","Ryan Rickelton","Quinton de Kock","N. Tilak Varma","Sherfane Rutherford","Robin Minz","Danish Malewar"], "All-Rounders": ["Hardik Pandya","Will Jacks","Mitchell Santner","Shardul Thakur","Corbin Bosch","Naman Dhir","Raj Angad Bawa","Atharva Ankolekar"], Bowlers: ["Jasprit Bumrah","Trent Boult","Deepak Chahar","Allah Ghazanfar","Mayank Markande","Ashwani Kumar","Mohammad Izhar","Raghu Sharma"] },
  KKR:  { Batters: ["Ajinkya Rahane","Rinku Singh","Finn Allen","Rovman Powell","Angkrish Raghuvanshi","Manish Pandey","Rahul Tripathi","Tim Seifert","Tejasvi Singh"], "All-Rounders": ["Sunil Narine","Cameron Green","Rachin Ravindra","Ramandeep Singh","Anukul Roy","Daksh Kamra","Sarthak Ranjan"], Bowlers: ["Matheesha Pathirana","Varun Chakaravarthy","Vaibhav Arora","Blessing Muzarabani","Navdeep Saini","Umran Malik","Kartik Tyagi","Saurabh Dubey","Prashant Solanki"] },
  SRH:  { Batters: ["Travis Head","Ishan Kishan","Heinrich Klaasen","Abhishek Sharma","Aniket Verma","Salil Arora","Smaran Ravichandran"], "All-Rounders": ["Nitish Kumar Reddy","Liam Livingstone","Kamindu Mendis","Harshal Patel","Brydon Carse","Harsh Dubey","David Payne","Shivang Kumar"], Bowlers: ["Pat Cummins","Shivam Mavi","Jaydev Unadkat","Zeeshan Ansari","Eshan Malinga","Sakib Hussain","Onkar Tarmale","Amit Kumar","Praful Hinge"] },
  DC:   { Batters: ["KL Rahul","Prithvi Shaw","Karun Nair","Pathum Nissanka","David Miller","Abishek Porel","Tristan Stubbs","Sahil Parakh"], "All-Rounders": ["Axar Patel","Sameer Rizvi","Ashutosh Sharma","Nitish Rana","Vipraj Nigam","Ajay Mandal","Tripurana Vijay","Madhav Tiwari"], Bowlers: ["Mitchell Starc","Kuldeep Yadav","T. Natarajan","Kyle Jamieson","Mukesh Kumar","Dushmantha Chameera","Auqib Nabi","Lungisani Ngidi"] },
  GT:   { Batters: ["Shubman Gill","Jos Buttler","Sai Sudharsan","Glenn Phillips","Tom Banton","Kumar Kushagra","Anuj Rawat"], "All-Rounders": ["Washington Sundar","Rahul Tewatia","Rashid Khan","Jayant Yadav","Jason Holder","Nishant Sindhu","Shahrukh Khan","Mohd. Arshad Khan","Sai Kishore"], Bowlers: ["Kagiso Rabada","Mohammed Siraj","Prasidh Krishna","Gurnoor Singh Brar","Ishant Sharma","Luke Wood","Manav Suthar","Ashok Sharma","Kulwant Khejroliya"] },
  RR:   { Batters: ["Yashasvi Jaiswal","Riyan Parag","Shimron Hetmyer","Dhruv Jurel","Vaibhav Suryavanshi","Shubham Dubey","Donovan Ferreira","Lhuan-Dre Pretorius"], "All-Rounders": ["Ravindra Jadeja","Dasun Shanaka","Yudhvir Singh Charak","Aman Rao Perala","Ravi Singh"], Bowlers: ["Jofra Archer","Ravi Bishnoi","Sandeep Sharma","Tushar Deshpande","Kwena Maphaka","Adam Milne","Nandre Burger","Kuldeep Sen","Vignesh Puthur","Sushant Mishra","Yash Raj Punja","Brijesh Sharma"] },
  PBKS: { Batters: ["Shreyas Iyer","Prabhsimran Singh","Shashank Singh","Nehal Wadhera","Vishnu Vinod","Harnoor Pannu","Pyla Avinash"], "All-Rounders": ["Marcus Stoinis","Marco Jansen","Priyansh Arya","Musheer Khan","Harpreet Brar","Azmatullah Omarzai","Mitch Owen","Cooper Connolly","Suryansh Shedge","Ben Dwarshuis"], Bowlers: ["Arshdeep Singh","Yuzvendra Chahal","Lockie Ferguson","Vyshak Vijaykumar","Xavier Bartlett","Yash Thakur","Pravin Dubey","Vishal Nishad"] },
  LSG:  { Batters: ["Rishabh Pant","Nicholas Pooran","Aiden Markram","Josh Inglis","Matthew Breetzke","Akshat Raghuwanshi","Himmat Singh","Mukul Choudhary"], "All-Rounders": ["Mitchell Marsh","Wanindu Hasaranga","Ayush Badoni","Shahbaz Ahamad","Arshin Kulkarni","Abdul Samad"], Bowlers: ["Mohammad Shami","Mayank Yadav","Anrich Nortje","Avesh Khan","Mohsin Khan","Arjun Tendulkar","M. Siddharth","Digvesh Singh","Akash Singh","Prince Yadav","Naman Tiwari"] },
};

const SCHEDULE = [
  // League stage (M1–M70)
  { id:1,  date:"Mar 28", team1:"SRH",  team2:"RCB",  venue:"M. Chinnaswamy Stadium, Bengaluru",              result:{ winner:"RCB",  s1:"201/9 (20)",   s2:"203/4 (15.4)", margin:"6 wkts",     battedFirst:"SRH"  }},
  { id:2,  date:"Mar 29", team1:"KKR",  team2:"MI",   venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"MI",   s1:"220/4 (20)",   s2:"224/4 (19.1)", margin:"6 wkts",     battedFirst:"KKR"  }},
  { id:3,  date:"Mar 30", team1:"CSK",  team2:"RR",   venue:"ACA Stadium, Guwahati",                          result:{ winner:"RR",   s1:"127/10 (19.4)",s2:"128/2 (12.1)", margin:"8 wkts",     battedFirst:"CSK"  }},
  { id:4,  date:"Mar 31", team1:"GT",   team2:"PBKS", venue:"New International Cricket Stadium, New Chandigarh", result:{ winner:"PBKS", s1:"162/6 (20)",   s2:"165/7 (19.1)", margin:"3 wkts",     battedFirst:"GT"   }},
  { id:5,  date:"Apr 1",  team1:"LSG",  team2:"DC",   venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"DC",   s1:"141/10 (18.4)",s2:"145/4 (17.1)", margin:"6 wkts",     battedFirst:"LSG"  }},
  { id:6,  date:"Apr 2",  team1:"SRH",  team2:"KKR",  venue:"Eden Gardens, Kolkata",                          result:{ winner:"SRH",  s1:"226/8 (20)",   s2:"161/10 (16)", margin:"65 runs",    battedFirst:"SRH"  }},
  { id:7,  date:"Apr 3",  team1:"CSK",  team2:"PBKS", venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"PBKS", s1:"209/5 (20)",   s2:"210/5 (18.4)", margin:"5 wkts",     battedFirst:"CSK"  }},
  { id:8,  date:"Apr 4",  team1:"MI",   team2:"DC",   venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"DC",   s1:"162/6 (20)",   s2:"164/4 (18.1)", margin:"6 wkts",     battedFirst:"MI"   }},
  { id:9,  date:"Apr 4",  team1:"RR",   team2:"GT",   venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"RR",   s1:"210/6 (20)",   s2:"204/8 (20)",   margin:"6 runs",     battedFirst:"RR"   }},
  { id:10, date:"Apr 5",  team1:"SRH",  team2:"LSG",  venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"LSG",  s1:"156/9 (20)",   s2:"160/5 (19.5)", margin:"5 wkts",     battedFirst:"SRH"  }},
  { id:11, date:"Apr 5",  team1:"RCB",  team2:"CSK",  venue:"M. Chinnaswamy Stadium, Bengaluru",              result:{ winner:"RCB",  s1:"250/3 (20)",   s2:"207/10 (19.4)",margin:"43 runs",    battedFirst:"RCB"  }},
  { id:12, date:"Apr 6",  team1:"KKR",  team2:"PBKS", venue:"Eden Gardens, Kolkata",                          result:null },
  { id:13, date:"Apr 7",  team1:"RR",   team2:"MI",   venue:"ACA Stadium, Guwahati",                          result:{ winner:"RR",   s1:"150/3 (11)",   s2:"123/9 (11)",   margin:"27 runs",    battedFirst:"RR"   }},
  { id:14, date:"Apr 8",  team1:"GT",   team2:"DC",   venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"GT",   s1:"210/4 (20)",   s2:"209/8 (20)",   margin:"1 run",      battedFirst:"GT"   }},
  { id:15, date:"Apr 9",  team1:"KKR",  team2:"LSG",  venue:"Eden Gardens, Kolkata",                          result:{ winner:"LSG",  s1:"181/4 (20)",   s2:"182/7 (20)",   margin:"3 wkts",     battedFirst:"KKR"  }},
  { id:16, date:"Apr 10", team1:"RCB",  team2:"RR",   venue:"ACA Stadium, Guwahati",                          result:{ winner:"RR",   s1:"201/8 (20)",   s2:"202/4 (18)",   margin:"6 wkts",     battedFirst:"RCB"  }},
  { id:17, date:"Apr 11", team1:"SRH",  team2:"PBKS", venue:"New International Cricket Stadium, New Chandigarh", result:{ winner:"PBKS", s1:"219/6 (20)",   s2:"223/4 (18.5)", margin:"6 wkts",     battedFirst:"SRH"  }},
  { id:18, date:"Apr 11", team1:"CSK",  team2:"DC",   venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"CSK",  s1:"212/2 (20)",   s2:"189/10 (20)",  margin:"23 runs",    battedFirst:"CSK"  }},
  { id:19, date:"Apr 12", team1:"LSG",  team2:"GT",   venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"GT",   s1:"164/8 (20)",   s2:"165/3 (18.4)", margin:"7 wkts",     battedFirst:"LSG"  }},
  { id:20, date:"Apr 12", team1:"RCB",  team2:"MI",   venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"RCB",  s1:"240/4 (20)",   s2:"222/5 (20)",   margin:"18 runs",    battedFirst:"RCB"  }},
  { id:21, date:"Apr 13", team1:"SRH",  team2:"RR",   venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"SRH",  s1:"216/6 (20)",   s2:"159/10 (19)",  margin:"57 runs",    battedFirst:"SRH"  }},
  { id:22, date:"Apr 14", team1:"CSK",  team2:"KKR",  venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"CSK",  s1:"192/5 (20)",   s2:"160/7 (20)",   margin:"32 runs",    battedFirst:"CSK"  }},
  { id:23, date:"Apr 15", team1:"LSG",  team2:"RCB",  venue:"M. Chinnaswamy Stadium, Bengaluru",              result:{ winner:"RCB",  s1:"146/10 (20)",  s2:"149/5 (15.1)", margin:"5 wkts",     battedFirst:"LSG"  }},
  { id:24, date:"Apr 16", team1:"MI",   team2:"PBKS", venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"PBKS", s1:"195/6 (20)",   s2:"198/3 (16.3)", margin:"7 wkts",     battedFirst:"MI"   }},
  { id:25, date:"Apr 17", team1:"KKR",  team2:"GT",   venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"GT",   s1:"180/10 (20)",  s2:"181/5 (19.4)", margin:"5 wkts",     battedFirst:"KKR"  }},
  { id:26, date:"Apr 18", team1:"RCB",  team2:"DC",   venue:"M. Chinnaswamy Stadium, Bengaluru",              result:{ winner:"DC",   s1:"175/8 (20)",   s2:"179/4 (19.5)", margin:"6 wkts",     battedFirst:"RCB"  }},
  { id:27, date:"Apr 18", team1:"SRH",  team2:"CSK",  venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"SRH",  s1:"194/9 (20)",   s2:"184/8 (20)",   margin:"10 runs",    battedFirst:"SRH"  }},
  { id:28, date:"Apr 19", team1:"RR",   team2:"KKR",  venue:"Eden Gardens, Kolkata",                          result:{ winner:"KKR",  s1:"155/9 (20)",   s2:"161/6 (19.4)", margin:"4 wkts",     battedFirst:"RR"   }},
  { id:29, date:"Apr 19", team1:"PBKS", team2:"LSG",  venue:"New International Cricket Stadium, New Chandigarh", result:{ winner:"PBKS", s1:"254/7 (20)",   s2:"200/5 (20)",   margin:"54 runs",    battedFirst:"PBKS" }},
  { id:30, date:"Apr 20", team1:"MI",   team2:"GT",   venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"MI",   s1:"199/5 (20)",   s2:"100/10 (15.5)",margin:"99 runs",    battedFirst:"MI"   }},
  { id:31, date:"Apr 21", team1:"SRH",  team2:"DC",   venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"SRH",  s1:"242/2 (20)",   s2:"195/9 (20)",   margin:"47 runs",    battedFirst:"SRH"  }},
  { id:32, date:"Apr 22", team1:"RR",   team2:"LSG",  venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"RR",   s1:"159/6 (20)",   s2:"119/10 (18)",  margin:"40 runs",    battedFirst:"RR"   }},
  { id:33, date:"Apr 23", team1:"CSK",  team2:"MI",   venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"CSK",  s1:"207/6 (20)",   s2:"104/10 (19)",  margin:"103 runs",   battedFirst:"CSK"  }},
  { id:34, date:"Apr 24", team1:"GT",   team2:"RCB",  venue:"M. Chinnaswamy Stadium, Bengaluru",              result:{ winner:"RCB",  s1:"205/3 (20)",   s2:"206/5 (18.5)", margin:"5 wkts",     battedFirst:"GT"   }},
  { id:35, date:"Apr 25", team1:"DC",   team2:"PBKS", venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"PBKS", s1:"264/2 (20)",   s2:"265/4 (18.5)", margin:"6 wkts",     battedFirst:"DC"   }},
  { id:36, date:"Apr 25", team1:"RR",   team2:"SRH",  venue:"Sawai Mansingh Stadium, Jaipur",                 result:{ winner:"SRH",  s1:"228/6 (20)",   s2:"229/5 (18.3)", margin:"5 wkts",     battedFirst:"RR"   }},
  { id:37, date:"Apr 26", team1:"CSK",  team2:"GT",   venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"GT",   s1:"158/7 (20)",   s2:"162/2 (16.4)", margin:"8 wkts",     battedFirst:"CSK"  }},
  { id:38, date:"Apr 26", team1:"KKR",  team2:"LSG",  venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"KKR",  s1:"155/7 (20)",   s2:"155/8 (20)",   margin:"Super Over", battedFirst:"KKR"  }},
  { id:39, date:"Apr 27", team1:"DC",   team2:"RCB",  venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"RCB",  s1:"75/10 (16.3)", s2:"77/1 (6.3)",   margin:"9 wkts",     battedFirst:"DC"   }},
  { id:40, date:"Apr 28", team1:"PBKS", team2:"RR",   venue:"New International Cricket Stadium, New Chandigarh", result:{ winner:"RR",   s1:"222/4 (20)",   s2:"228/4 (19.2)", margin:"6 wkts",     battedFirst:"PBKS" }},
  { id:41, date:"Apr 29", team1:"MI",   team2:"SRH",  venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"SRH",  s1:"243/5 (20)",   s2:"249/4 (18.4)", margin:"6 wkts",     battedFirst:"MI"   }},
  { id:42, date:"Apr 30", team1:"RCB",  team2:"GT",   venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"GT",   s1:"155/10 (19.2)",s2:"158/6 (15.5)", margin:"4 wkts",     battedFirst:"RCB"  }},
  { id:43, date:"May 1",  team1:"RR",   team2:"DC",   venue:"Sawai Mansingh Stadium, Jaipur",                 result:{ winner:"DC",   s1:"225/6 (20)",   s2:"226/3 (19.1)", margin:"7 wkts",     battedFirst:"RR"   }},
  { id:44, date:"May 2",  team1:"MI",   team2:"CSK",  venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"CSK",  s1:"159/7 (20)",   s2:"160/2 (18.1)", margin:"8 wkts",     battedFirst:"MI"   }},
  { id:45, date:"May 3",  team1:"SRH",  team2:"KKR",  venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"KKR",  s1:"165/10 (19)",  s2:"169/3 (18.2)", margin:"7 wkts",     battedFirst:"SRH"  }},
  { id:46, date:"May 3",  team1:"PBKS", team2:"GT",   venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"GT",   s1:"163/9 (20)",   s2:"167/6 (19.5)", margin:"4 wkts",     battedFirst:"PBKS" }},
  { id:47, date:"May 4",  team1:"LSG",  team2:"MI",   venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"MI",   s1:"228/5 (20)",   s2:"229/4 (18.4)", margin:"6 wkts",     battedFirst:"LSG"  }},
  { id:48, date:"May 5",  team1:"DC",   team2:"CSK",  venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"CSK",  s1:"155/7 (20)",   s2:"159/2 (17.3)", margin:"8 wkts",     battedFirst:"DC"   }},
  { id:49, date:"May 6",  team1:"SRH",  team2:"PBKS", venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"SRH",  s1:"235/4 (20)",   s2:"202/7 (20)",   margin:"33 runs",    battedFirst:"SRH"  }},
  { id:50, date:"May 7",  team1:"LSG",  team2:"RCB",  venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"LSG",  s1:"209/3 (19)",   s2:"203/6 (19)",   margin:"9 runs (D/L)",battedFirst:"LSG" }},
  { id:51, date:"May 8",  team1:"DC",   team2:"KKR",  venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"KKR",  s1:"142/8 (20)",   s2:"147/2 (14.2)", margin:"8 wkts",     battedFirst:"DC"   }},
  { id:52, date:"May 9",  team1:"GT",   team2:"RR",   venue:"Sawai Mansingh Stadium, Jaipur",                 result:{ winner:"GT",   s1:"229/4 (20)",   s2:"152/10 (16.3)",margin:"77 runs",    battedFirst:"GT"   }},
  { id:53, date:"May 10", team1:"LSG",  team2:"CSK",  venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"CSK",  s1:"203/8 (20)",   s2:"208/5 (19.2)", margin:"5 wkts",     battedFirst:"LSG"  }},
  { id:54, date:"May 10", team1:"MI",   team2:"RCB",  venue:"VSNIS Stadium, Raipur",                          result:{ winner:"RCB",  s1:"166/7 (20)",   s2:"167/8 (20)",   margin:"2 wkts",     battedFirst:"MI"   }},
  { id:55, date:"May 11", team1:"PBKS", team2:"DC",   venue:"HPCA Stadium, Dharamshala",                      result:{ winner:"DC",   s1:"210/5 (20)",   s2:"216/7 (19)",   margin:"3 wkts",     battedFirst:"PBKS" }},
  { id:56, date:"May 12", team1:"GT",   team2:"SRH",  venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"GT",   s1:"168/5 (20)",   s2:"86/10 (14.5)", margin:"82 runs",    battedFirst:"GT"   }},
  { id:57, date:"May 13", team1:"KKR",  team2:"RCB",  venue:"VSNIS Stadium, Raipur",                          result:{ winner:"RCB",  s1:"192/4 (20)",   s2:"194/4 (19.1)", margin:"6 wkts",     battedFirst:"KKR"  }},
  { id:58, date:"May 14", team1:"PBKS", team2:"MI",   venue:"HPCA Stadium, Dharamshala",                      result:{ winner:"MI",   s1:"200/8 (20)",   s2:"205/4 (19.5)", margin:"6 wkts",     battedFirst:"PBKS" }},
  { id:59, date:"May 15", team1:"CSK",  team2:"LSG",  venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"LSG",  s1:"187/5 (20)",   s2:"188/3 (16.4)", margin:"7 wkts",     battedFirst:"CSK"  }},
  { id:60, date:"May 16", team1:"KKR",  team2:"GT",   venue:"Eden Gardens, Kolkata",                          result:{ winner:"KKR",  s1:"247/2 (20)",   s2:"218/4 (20)",   margin:"29 runs",    battedFirst:"KKR"  }},
  { id:61, date:"May 17", team1:"RCB",  team2:"PBKS", venue:"HPCA Stadium, Dharamshala",                      result:{ winner:"RCB",  s1:"222/4 (20)",   s2:"199/8 (20)",   margin:"23 runs",    battedFirst:"RCB"  }},
  { id:62, date:"May 17", team1:"RR",   team2:"DC",   venue:"Arun Jaitley Stadium, Delhi",                    result:{ winner:"DC",   s1:"193/8 (20)",   s2:"197/5 (19.2)", margin:"5 wkts",     battedFirst:"RR"   }},
  { id:63, date:"May 18", team1:"CSK",  team2:"SRH",  venue:"MA Chidambaram Stadium, Chennai",                result:{ winner:"SRH",  s1:"180/7 (20)",   s2:"181/5 (19)",   margin:"5 wkts",     battedFirst:"CSK"  }},
  { id:64, date:"May 19", team1:"LSG",  team2:"RR",   venue:"Sawai Mansingh Stadium, Jaipur",                 result:{ winner:"RR",   s1:"220/5 (20)",   s2:"225/3 (19.1)", margin:"7 wkts",     battedFirst:"LSG"  }},
  { id:65, date:"May 20", team1:"MI",   team2:"KKR",  venue:"Eden Gardens, Kolkata",                          result:{ winner:"KKR",  s1:"147/8 (20)",   s2:"148/6 (18.5)", margin:"4 wkts",     battedFirst:"MI"   }},
  { id:66, date:"May 21", team1:"GT",   team2:"CSK",  venue:"Narendra Modi Stadium, Ahmedabad",               result:{ winner:"GT",   s1:"229/4 (20)",   s2:"140/10 (13.4)",margin:"89 runs",    battedFirst:"GT"   }},
  { id:67, date:"May 22", team1:"SRH",  team2:"RCB",  venue:"Rajiv Gandhi Intl. Cricket Stadium, Hyderabad",  result:{ winner:"SRH",  s1:"255/4 (20)",   s2:"200/4 (20)",   margin:"55 runs",    battedFirst:"SRH"  }},
  { id:68, date:"May 23", team1:"LSG",  team2:"PBKS", venue:"Ekana Cricket Stadium, Lucknow",                 result:{ winner:"PBKS", s1:"196/6 (20)",   s2:"200/3 (18)",   margin:"7 wkts",     battedFirst:"LSG"  }},
  { id:69, date:"May 24", team1:"RR",   team2:"MI",   venue:"Wankhede Stadium, Mumbai",                       result:{ winner:"RR",   s1:"205/8 (20)",   s2:"175/9 (20)",   margin:"30 runs",    battedFirst:"RR"   }},
  { id:70, date:"May 24", team1:"DC",   team2:"KKR",  venue:"Eden Gardens, Kolkata",                          result:{ winner:"DC",   s1:"203/5 (20)",   s2:"163/10 (18.4)",margin:"40 runs",    battedFirst:"DC"   }},
  // Playoffs
  { id:71, date:"May 26", team1:"RCB",  team2:"GT",   venue:"HPCA Stadium, Dharamshala",                      result:{ winner:"RCB",  s1:"254/5 (20)",   s2:"162/10 (19.3)",margin:"92 runs",    battedFirst:"RCB"  }, playoff:true },
  { id:72, date:"May 27", team1:"RR",   team2:"SRH",  venue:"New International Cricket Stadium, New Chandigarh", result:{ winner:"RR",   s1:"243/8 (20)",   s2:"196/10 (19.2)",margin:"47 runs",    battedFirst:"RR"   }, playoff:true },
  { id:73, date:"May 29", team1:"RR",   team2:"GT",   venue:"New International Cricket Stadium, New Chandigarh", result:{ winner:"GT",   s1:"214/6 (20)",   s2:"219/3 (18.4)", margin:"7 wkts",     battedFirst:"RR"   }, playoff:true },
  { id:74, date:"May 31", team1:"GT",   team2:"RCB",  venue:"Narendra Modi Stadium, Ahmedabad",               result:null, playoff:true },
];

const H2H_DATA = {
  "RCB-CSK":  { allTime:{t1:10,t2:21,n:31}, chase:{t1:5,t2:11,n:16},  field:{t1:5,t2:10,n:15},  venues:{"Chennai":{"t1":2,"t2":7,"n":9},"Bengaluru":{"t1":6,"t2":3,"n":9}} },
  "RCB-MI":   { allTime:{t1:14,t2:18,n:32}, chase:{t1:7,t2:9,n:16},   field:{t1:7,t2:9,n:16},   venues:{"Bengaluru":{"t1":7,"t2":4,"n":11},"Mumbai":{"t1":4,"t2":8,"n":12}} },
  "RCB-KKR":  { allTime:{t1:14,t2:15,n:29}, chase:{t1:7,t2:8,n:15},   field:{t1:7,t2:7,n:14},   venues:{"Bengaluru":{"t1":8,"t2":4,"n":12},"Kolkata":{"t1":4,"t2":8,"n":12}} },
  "RCB-DC":   { allTime:{t1:15,t2:14,n:29}, chase:{t1:8,t2:7,n:15},   field:{t1:7,t2:7,n:14},   venues:{"Bengaluru":{"t1":8,"t2":4,"n":12},"Delhi":{"t1":5,"t2":7,"n":12}} },
  "RCB-SRH":  { allTime:{t1:9,t2:15,n:24},  chase:{t1:5,t2:7,n:12},   field:{t1:4,t2:8,n:12},   venues:{"Bengaluru":{"t1":6,"t2":4,"n":10},"Hyderabad":{"t1":2,"t2":7,"n":9}} },
  "RCB-GT":   { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Bengaluru":{"t1":2,"t2":1,"n":3},"Ahmedabad":{"t1":1,"t2":2,"n":3}} },
  "RCB-RR":   { allTime:{t1:10,t2:14,n:24}, chase:{t1:5,t2:7,n:12},   field:{t1:5,t2:7,n:12},   venues:{"Bengaluru":{"t1":6,"t2":3,"n":9},"Jaipur":{"t1":3,"t2":6,"n":9}} },
  "RCB-PBKS": { allTime:{t1:12,t2:14,n:26}, chase:{t1:6,t2:7,n:13},   field:{t1:6,t2:7,n:13},   venues:{"Bengaluru":{"t1":7,"t2":4,"n":11},"Dharamshala":{"t1":3,"t2":5,"n":8}} },
  "RCB-LSG":  { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Bengaluru":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":1,"t2":2,"n":3}} },
  "CSK-MI":   { allTime:{t1:17,t2:19,n:36}, chase:{t1:9,t2:10,n:19},  field:{t1:8,t2:9,n:17},   venues:{"Chennai":{"t1":10,"t2":5,"n":15},"Mumbai":{"t1":4,"t2":10,"n":14}} },
  "CSK-KKR":  { allTime:{t1:17,t2:13,n:30}, chase:{t1:9,t2:7,n:16},   field:{t1:8,t2:6,n:14},   venues:{"Chennai":{"t1":9,"t2":4,"n":13},"Kolkata":{"t1":5,"t2":7,"n":12}} },
  "CSK-DC":   { allTime:{t1:18,t2:12,n:30}, chase:{t1:9,t2:6,n:15},   field:{t1:9,t2:6,n:15},   venues:{"Chennai":{"t1":9,"t2":3,"n":12},"Delhi":{"t1":6,"t2":6,"n":12}} },
  "CSK-SRH":  { allTime:{t1:11,t2:10,n:21}, chase:{t1:6,t2:5,n:11},   field:{t1:5,t2:5,n:10},   venues:{"Chennai":{"t1":7,"t2":3,"n":10},"Hyderabad":{"t1":3,"t2":6,"n":9}} },
  "CSK-GT":   { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Chennai":{"t1":2,"t2":1,"n":3},"Ahmedabad":{"t1":1,"t2":2,"n":3}} },
  "CSK-RR":   { allTime:{t1:17,t2:11,n:28}, chase:{t1:9,t2:5,n:14},   field:{t1:8,t2:6,n:14},   venues:{"Chennai":{"t1":9,"t2":4,"n":13},"Jaipur":{"t1":5,"t2":5,"n":10}} },
  "CSK-PBKS": { allTime:{t1:18,t2:11,n:29}, chase:{t1:9,t2:5,n:14},   field:{t1:9,t2:6,n:15},   venues:{"Chennai":{"t1":9,"t2":3,"n":12},"Dharamshala":{"t1":5,"t2":4,"n":9}} },
  "CSK-LSG":  { allTime:{t1:4,t2:2,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Chennai":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":1,"t2":1,"n":2}} },
  "MI-KKR":   { allTime:{t1:18,t2:14,n:32}, chase:{t1:9,t2:7,n:16},   field:{t1:9,t2:7,n:16},   venues:{"Mumbai":{"t1":10,"t2":4,"n":14},"Kolkata":{"t1":5,"t2":7,"n":12}} },
  "MI-DC":    { allTime:{t1:17,t2:12,n:29}, chase:{t1:9,t2:6,n:15},   field:{t1:8,t2:6,n:14},   venues:{"Mumbai":{"t1":9,"t2":4,"n":13},"Delhi":{"t1":5,"t2":6,"n":11}} },
  "MI-SRH":   { allTime:{t1:12,t2:11,n:23}, chase:{t1:6,t2:6,n:12},   field:{t1:6,t2:5,n:11},   venues:{"Mumbai":{"t1":7,"t2":4,"n":11},"Hyderabad":{"t1":4,"t2":6,"n":10}} },
  "MI-GT":    { allTime:{t1:4,t2:2,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Mumbai":{"t1":3,"t2":1,"n":4},"Ahmedabad":{"t1":1,"t2":1,"n":2}} },
  "MI-RR":    { allTime:{t1:18,t2:11,n:29}, chase:{t1:9,t2:6,n:15},   field:{t1:9,t2:5,n:14},   venues:{"Mumbai":{"t1":9,"t2":4,"n":13},"Jaipur":{"t1":5,"t2":5,"n":10}} },
  "MI-PBKS":  { allTime:{t1:18,t2:11,n:29}, chase:{t1:9,t2:5,n:14},   field:{t1:9,t2:6,n:15},   venues:{"Mumbai":{"t1":9,"t2":4,"n":13},"Dharamshala":{"t1":5,"t2":4,"n":9}} },
  "MI-LSG":   { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Mumbai":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":1,"t2":2,"n":3}} },
  "KKR-DC":   { allTime:{t1:16,t2:13,n:29}, chase:{t1:8,t2:7,n:15},   field:{t1:8,t2:6,n:14},   venues:{"Kolkata":{"t1":8,"t2":4,"n":12},"Delhi":{"t1":5,"t2":6,"n":11}} },
  "KKR-SRH":  { allTime:{t1:11,t2:10,n:21}, chase:{t1:6,t2:5,n:11},   field:{t1:5,t2:5,n:10},   venues:{"Kolkata":{"t1":6,"t2":4,"n":10},"Hyderabad":{"t1":4,"t2":5,"n":9}} },
  "KKR-GT":   { allTime:{t1:3,t2:3,n:6},    chase:{t1:1,t2:2,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Kolkata":{"t1":2,"t2":1,"n":3},"Ahmedabad":{"t1":1,"t2":2,"n":3}} },
  "KKR-RR":   { allTime:{t1:18,t2:12,n:30}, chase:{t1:9,t2:6,n:15},   field:{t1:9,t2:6,n:15},   venues:{"Kolkata":{"t1":9,"t2":4,"n":13},"Jaipur":{"t1":5,"t2":6,"n":11}} },
  "KKR-PBKS": { allTime:{t1:17,t2:13,n:30}, chase:{t1:9,t2:7,n:16},   field:{t1:8,t2:6,n:14},   venues:{"Kolkata":{"t1":9,"t2":4,"n":13},"Dharamshala":{"t1":4,"t2":6,"n":10}} },
  "KKR-LSG":  { allTime:{t1:4,t2:2,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Kolkata":{"t1":3,"t2":1,"n":4},"Lucknow":{"t1":1,"t2":1,"n":2}} },
  "DC-SRH":   { allTime:{t1:12,t2:14,n:26}, chase:{t1:6,t2:7,n:13},   field:{t1:6,t2:7,n:13},   venues:{"Delhi":{"t1":6,"t2":5,"n":11},"Hyderabad":{"t1":5,"t2":7,"n":12}} },
  "DC-GT":    { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Delhi":{"t1":2,"t2":1,"n":3},"Ahmedabad":{"t1":1,"t2":2,"n":3}} },
  "DC-RR":    { allTime:{t1:14,t2:14,n:28}, chase:{t1:7,t2:7,n:14},   field:{t1:7,t2:7,n:14},   venues:{"Delhi":{"t1":7,"t2":5,"n":12},"Jaipur":{"t1":5,"t2":6,"n":11}} },
  "DC-PBKS":  { allTime:{t1:15,t2:13,n:28}, chase:{t1:8,t2:6,n:14},   field:{t1:7,t2:7,n:14},   venues:{"Delhi":{"t1":8,"t2":4,"n":12},"Dharamshala":{"t1":4,"t2":6,"n":10}} },
  "DC-LSG":   { allTime:{t1:4,t2:2,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Delhi":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":1,"t2":1,"n":2}} },
  "SRH-GT":   { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Hyderabad":{"t1":2,"t2":1,"n":3},"Ahmedabad":{"t1":1,"t2":2,"n":3}} },
  "SRH-RR":   { allTime:{t1:11,t2:9,n:20},  chase:{t1:6,t2:4,n:10},   field:{t1:5,t2:5,n:10},   venues:{"Hyderabad":{"t1":7,"t2":3,"n":10},"Jaipur":{"t1":4,"t2":5,"n":9}} },
  "SRH-PBKS": { allTime:{t1:11,t2:10,n:21}, chase:{t1:6,t2:5,n:11},   field:{t1:5,t2:5,n:10},   venues:{"Hyderabad":{"t1":6,"t2":4,"n":10},"Dharamshala":{"t1":4,"t2":5,"n":9}} },
  "SRH-LSG":  { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Hyderabad":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":1,"t2":2,"n":3}} },
  "GT-RR":    { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Ahmedabad":{"t1":2,"t2":1,"n":3},"Jaipur":{"t1":1,"t2":2,"n":3}} },
  "GT-PBKS":  { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Ahmedabad":{"t1":2,"t2":1,"n":3},"Dharamshala":{"t1":1,"t2":2,"n":3}} },
  "GT-LSG":   { allTime:{t1:4,t2:2,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Ahmedabad":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":2,"t2":1,"n":3}} },
  "RR-PBKS":  { allTime:{t1:15,t2:13,n:28}, chase:{t1:8,t2:7,n:15},   field:{t1:7,t2:6,n:13},   venues:{"Jaipur":{"t1":7,"t2":4,"n":11},"Dharamshala":{"t1":5,"t2":6,"n":11}} },
  "RR-LSG":   { allTime:{t1:4,t2:2,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:2,t2:1,n:3},    venues:{"Jaipur":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":2,"t2":1,"n":3}} },
  "PBKS-LSG": { allTime:{t1:3,t2:3,n:6},    chase:{t1:2,t2:1,n:3},    field:{t1:1,t2:2,n:3},    venues:{"Dharamshala":{"t1":2,"t2":1,"n":3},"Lucknow":{"t1":1,"t2":2,"n":3}} },
};

function getH2H(t1, t2) {
  const key = `${t1}-${t2}`;
  const rev = `${t2}-${t1}`;
  if (H2H_DATA[key]) return { data: H2H_DATA[key], swapped: false };
  if (H2H_DATA[rev]) return { data: H2H_DATA[rev], swapped: true };
  return null;
}

function resolveH2H(t1code, t2code) {
  const result = getH2H(t1code, t2code);
  if (!result) return null;
  const { data, swapped } = result;
  if (!swapped) return data;
  return {
    allTime: { t1: data.allTime.t2, t2: data.allTime.t1, n: data.allTime.n },
    chase:   { t1: data.chase.t2,   t2: data.chase.t1,   n: data.chase.n   },
    field:   { t1: data.field.t2,   t2: data.field.t1,   n: data.field.n   },
    venues:  data.venues,
  };
}

const SEED = 42;
function seededRand(i) {
  const x = Math.sin(i + SEED) * 10000;
  return x - Math.floor(x);
}
function computeStandings() {
  const pts = {};
  Object.keys(TEAMS).forEach((t, i) => {
    pts[t] = { team: t, p: 0, w: 0, l: 0, pts: 0, nrr: (seededRand(i) * 2 - 1).toFixed(3) };
  });
  SCHEDULE.forEach(m => {
    if (!m.result || m.playoff) return;
    const w = m.result.winner;
    const l = w === m.team1 ? m.team2 : m.team1;
    pts[w].p++; pts[w].w++; pts[w].pts += 2;
    pts[l].p++; pts[l].l++;
  });
  return Object.values(pts).sort((a, b) => b.pts - a.pts || parseFloat(b.nrr) - parseFloat(a.nrr));
}

/* ============================================================
   STYLES
   ============================================================ */
const S = {
  // Layout
  page: { minHeight: "100vh", background: "#0a0a0f", color: "#f0f0f5", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif" },
  container: { maxWidth: 960, margin: "0 auto", padding: "0 16px 60px" },

  // Header
  header: { background: "rgba(255,107,0,0.06)", borderBottom: "1px solid rgba(255,107,0,0.15)", padding: "0 16px", marginBottom: 0 },
  headerInner: { maxWidth: 960, margin: "0 auto", display: "flex", alignItems: "center", gap: 14, height: 60 },
  logo: { width: 38, height: 38, borderRadius: 10, background: "linear-gradient(135deg,#FF6B00,#FF9A00)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 },
  logoText: { fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px", color: "#fff" },
  logoSub: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginTop: 1 },
  badge: { marginLeft: "auto", background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 11, color: "#FF9A00", fontWeight: 600 },

  // Nav
  nav: { display: "flex", gap: 4, padding: "16px 0 20px" },
  navBtn: (active) => ({
    padding: "8px 20px", borderRadius: 20, border: active ? "none" : "1px solid rgba(255,255,255,0.1)",
    background: active ? "#FF6B00" : "transparent",
    color: active ? "#fff" : "rgba(255,255,255,0.6)",
    cursor: "pointer", fontSize: 13, fontWeight: active ? 700 : 400,
    transition: "all 0.15s",
  }),

  // Cards
  card: { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "16px 18px" },
  cardHover: { cursor: "pointer", transition: "all 0.15s" },

  // Text
  label: { fontSize: 11, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.6px", fontWeight: 600 },
  muted: { color: "rgba(255,255,255,0.45)", fontSize: 13 },
  strong: { fontWeight: 700, color: "#fff" },

  // Pill
  pill: (color) => ({ background: `${color}25`, border: `1px solid ${color}55`, borderRadius: 8, padding: "3px 10px", fontSize: 11, color, fontWeight: 600 }),
};

/* ============================================================
   MINI COMPONENTS
   ============================================================ */
function TeamBadge({ code, size = 36 }) {
  const t = TEAMS[code];
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: `${t.primary}33`, border: `2px solid ${t.primary}`,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.28, fontWeight: 800, color: t.primary,
      flexShrink: 0, letterSpacing: "-0.5px",
    }}>
      {code.slice(0, 2)}
    </div>
  );
}

function WinBar({ t1, t2, t1wins, t2wins, total }) {
  const t1pct = total > 0 ? Math.round((t1wins / total) * 100) : 50;
  const t2pct = 100 - t1pct;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>
        <span style={{ color: TEAMS[t1].primary }}>{t1wins}W</span>
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{total} matches</span>
        <span style={{ color: TEAMS[t2].primary }}>{t2wins}W</span>
      </div>
      <div style={{ display: "flex", height: 10, borderRadius: 5, overflow: "hidden", background: "rgba(255,255,255,0.07)" }}>
        <div style={{ width: `${t1pct}%`, background: TEAMS[t1].primary, transition: "width 0.5s ease" }} />
        <div style={{ width: `${t2pct}%`, background: TEAMS[t2].primary }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
        <span>{t1pct}%</span>
        <span>{t2pct}%</span>
      </div>
    </div>
  );
}

function FilterBar({ options, active, onChange, right }) {
  return (
    <div style={{ display: "flex", gap: 6, marginBottom: 18, alignItems: "center", flexWrap: "wrap" }}>
      {options.map(([v, l]) => (
        <button key={v} onClick={() => onChange(v)}
          style={{
            padding: "7px 16px", borderRadius: 20,
            border: active === v ? "none" : "1px solid rgba(255,255,255,0.12)",
            background: active === v ? "#FF6B00" : "transparent",
            color: active === v ? "#fff" : "rgba(255,255,255,0.55)",
            cursor: "pointer", fontSize: 13, fontWeight: active === v ? 700 : 400,
          }}
        >{l}</button>
      ))}
      {right && <span style={{ marginLeft: "auto", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{right}</span>}
    </div>
  );
}

/* ============================================================
   TEAMS VIEW
   ============================================================ */
function TeamsView({ onSelect }) {
  return (
    <div>
      <p style={{ ...S.muted, marginBottom: 20 }}>10 franchises · 28 Mar – 31 May 2026 · Defending champions: <span style={{ color: "#CC0000", fontWeight: 700 }}>RCB</span></p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 12 }}>
        {Object.entries(TEAMS).map(([code, t]) => (
          <div key={code} onClick={() => onSelect(code)}
            style={{
              ...S.card, ...S.cardHover,
              borderLeft: `3px solid ${t.primary}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "none"; }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <TeamBadge code={code} size={48} />
              <div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#fff" }}>{t.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 3 }}>
                  {t.titles > 0 ? `🏆 ${t.titles}× Champion` : "Yet to win title"}
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: 10, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              <div style={{ fontSize: 12 }}><span style={{ color: "rgba(255,255,255,0.35)" }}>Captain </span><span style={{ color: "#fff", fontWeight: 600 }}>{t.captain.split(" ").slice(-1)[0]}</span></div>
              <div style={{ fontSize: 12 }}><span style={{ color: "rgba(255,255,255,0.35)" }}>Coach </span><span style={{ color: "#fff", fontWeight: 600 }}>{t.coach.split(" ").slice(-1)[0]}</span></div>
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 8 }}>🏟 {t.home.split(",")[0]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TeamDetail({ code, onBack }) {
  const t = TEAMS[code];
  const sq = SQUADS[code];
  const [activeRole, setActiveRole] = useState("Batters");
  const roles = Object.keys(sq);

  return (
    <div>
      <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: 14, padding: "0 0 18px 0", display: "flex", alignItems: "center", gap: 6 }}>
        ← All Teams
      </button>

      <div style={{ ...S.card, borderTop: `3px solid ${t.primary}`, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 14 }}>
          <TeamBadge code={code} size={60} />
          <div>
            <h2 style={{ margin: 0, fontWeight: 800, fontSize: 22, color: "#fff" }}>{t.name}</h2>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>🏟 {t.home}</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
          {[["Captain", t.captain], ["Coach", t.coach], ["Titles", t.titles || "—"], ["Season", "2026"]].map(([k, v]) => (
            <div key={k} style={{ background: "rgba(255,255,255,0.05)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={S.label}>{k}</div>
              <div style={{ fontWeight: 700, fontSize: 13, marginTop: 4, color: "#fff" }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {roles.map(r => (
          <button key={r} onClick={() => setActiveRole(r)}
            style={{
              padding: "8px 18px", borderRadius: 20,
              border: activeRole === r ? "none" : "1px solid rgba(255,255,255,0.12)",
              background: activeRole === r ? t.primary : "transparent",
              color: activeRole === r ? "#fff" : "rgba(255,255,255,0.55)",
              cursor: "pointer", fontSize: 13, fontWeight: activeRole === r ? 700 : 400,
            }}
          >{r} ({sq[r].length})</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 8 }}>
        {sq[activeRole].map((player, i) => (
          <div key={i} style={{ ...S.card, display: "flex", alignItems: "center", gap: 10, padding: "10px 14px" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${t.primary}20`, border: `1px solid ${t.primary}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: t.primary, flexShrink: 0 }}>
              {player.split(" ").map(w => w[0]).join("").slice(0, 2)}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#f0f0f5" }}>{player}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   SCHEDULE VIEW
   ============================================================ */
function ScheduleView({ onMatchClick }) {
  const [filter, setFilter] = useState("all");
  const filtered = SCHEDULE.filter(m =>
    filter === "played" ? !!m.result :
    filter === "upcoming" ? !m.result : true
  );

  return (
    <div>
      <FilterBar
        options={[["all", "All Matches"], ["played", "Results"], ["upcoming", "Upcoming"]]}
        active={filter}
        onChange={setFilter}
        right="Click any match for H2H →"
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(m => {
          const t1 = TEAMS[m.team1], t2 = TEAMS[m.team2];
          const played = !!m.result;
          return (
            <div key={m.id} onClick={() => onMatchClick(m)}
              style={{ ...S.card, ...S.cardHover }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,107,0,0.4)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Match number / date */}
                <div style={{ minWidth: 54, textAlign: "center" }}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>M{m.id}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.45)", fontWeight: 600, marginTop: 1 }}>{m.date}</div>
                </div>

                {/* Team 1 */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 15, color: played && m.result.winner === m.team1 ? t1.primary : "#fff" }}>{t1.short}</div>
                    {played && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{m.result.s1}</div>}
                  </div>
                  <TeamBadge code={m.team1} size={34} />
                </div>

                {/* VS */}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", width: 28, textAlign: "center", fontWeight: 600 }}>vs</div>

                {/* Team 2 */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                  <TeamBadge code={m.team2} size={34} />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: played && m.result.winner === m.team2 ? t2.primary : "#fff" }}>{t2.short}</div>
                    {played && <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{m.result.s2}</div>}
                  </div>
                </div>

                {/* Result */}
                <div style={{ minWidth: 110, textAlign: "right" }}>
                  {played ? (
                    <>
                      <div style={{ fontSize: 12, fontWeight: 700, color: TEAMS[m.result.winner].primary }}>{m.result.winner} won</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>by {m.result.margin}</div>
                    </>
                  ) : (
                    <span style={{ ...S.pill("#FF6B00"), fontSize: 11 }}>Upcoming</span>
                  )}
                </div>
              </div>

              {/* Venue */}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.06)", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                🏟 {m.venue}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   H2H PANEL
   ============================================================ */
function H2HPanel({ match, onClose }) {
  const [tab, setTab] = useState("alltime");
  const { team1: t1code, team2: t2code } = match;
  const t1 = TEAMS[t1code], t2 = TEAMS[t2code];
  const h2h = resolveH2H(t1code, t2code);
  if (!h2h) return null;

  const venueName = match.venue.split(",")[0];
  const vkey = h2h.venues && Object.keys(h2h.venues).find(k => match.venue.toLowerCase().includes(k.toLowerCase()));
  const venueRecord = vkey ? h2h.venues[vkey] : null;

  return (
    <>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 90 }} />

      {/* Panel */}
      <div style={{
        position: "fixed", top: 0, right: 0, width: 380, height: "100%",
        background: "#141419", borderLeft: "1px solid rgba(255,255,255,0.1)",
        overflowY: "auto", zIndex: 100, padding: 22,
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: "#fff" }}>Head to Head</div>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", cursor: "pointer", fontSize: 18, color: "rgba(255,255,255,0.6)", width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>

        {/* Teams strip */}
        <div style={{ background: "rgba(255,255,255,0.05)", borderRadius: 14, padding: "16px", marginBottom: 18, display: "flex", alignItems: "center" }}>
          <div style={{ flex: 1, textAlign: "center" }}>
            <TeamBadge code={t1code} size={48} />
            <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginTop: 6 }}>{t1.short}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{t1.captain.split(" ").slice(-1)[0]}</div>
          </div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", fontWeight: 700, padding: "0 12px" }}>vs</div>
          <div style={{ flex: 1, textAlign: "center" }}>
            <TeamBadge code={t2code} size={48} />
            <div style={{ fontWeight: 800, fontSize: 13, color: "#fff", marginTop: 6 }}>{t2.short}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)" }}>{t2.captain.split(" ").slice(-1)[0]}</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 20 }}>
          {[["alltime", "All-Time"], ["venue", "At Venue"], ["mode", "Bat / Chase"]].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              style={{
                padding: "8px 4px", borderRadius: 10,
                border: tab === id ? "none" : "1px solid rgba(255,255,255,0.1)",
                background: tab === id ? "#FF6B00" : "rgba(255,255,255,0.04)",
                color: tab === id ? "#fff" : "rgba(255,255,255,0.5)",
                cursor: "pointer", fontSize: 12, fontWeight: tab === id ? 700 : 400,
              }}
            >{label}</button>
          ))}
        </div>

        {/* Tab: All-Time */}
        {tab === "alltime" && (
          <div>
            <p style={{ ...S.muted, marginBottom: 16, fontSize: 12 }}>
              <strong style={{ color: "#fff" }}>{h2h.allTime.n}</strong> total meetings across all IPL seasons (2008–2025)
            </p>
            <WinBar t1={t1code} t2={t2code} t1wins={h2h.allTime.t1} t2wins={h2h.allTime.t2} total={h2h.allTime.n} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
              {[[t1code, h2h.allTime.t1], [t2code, h2h.allTime.t2]].map(([code, wins]) => (
                <div key={code} style={{ background: `${TEAMS[code].primary}15`, border: `1px solid ${TEAMS[code].primary}30`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: TEAMS[code].primary }}>{wins}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{TEAMS[code].short} Wins</div>
                </div>
              ))}
            </div>

            {match.result && (
              <div style={{ marginTop: 18, padding: "14px", borderRadius: 12, background: `${TEAMS[match.result.winner].primary}18`, border: `1px solid ${TEAMS[match.result.winner].primary}40` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: TEAMS[match.result.winner].primary, textTransform: "uppercase", letterSpacing: "0.5px" }}>IPL 2026 · {match.date}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginTop: 6 }}>{match.result.winner} won by {match.result.margin}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }}>{match.result.battedFirst} batted first</div>
                <div style={{ marginTop: 8, fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{match.result.s1} &nbsp;/&nbsp; {match.result.s2}</div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Venue */}
        {tab === "venue" && (
          <div>
            <p style={{ ...S.muted, marginBottom: 16, fontSize: 12 }}>
              Record at <strong style={{ color: "#fff" }}>{venueName}</strong>
            </p>
            {venueRecord ? (
              <>
                <WinBar t1={t1code} t2={t2code} t1wins={venueRecord.t1} t2wins={venueRecord.t2} total={venueRecord.n} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
                  {[[t1code, venueRecord.t1], [t2code, venueRecord.t2]].map(([code, wins]) => (
                    <div key={code} style={{ background: `${TEAMS[code].primary}15`, border: `1px solid ${TEAMS[code].primary}30`, borderRadius: 12, padding: "14px", textAlign: "center" }}>
                      <div style={{ fontSize: 32, fontWeight: 800, color: TEAMS[code].primary }}>{wins}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{TEAMS[code].short} wins here</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 12, textAlign: "center", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{venueRecord.n} meetings at this ground</div>
              </>
            ) : (
              <div style={{ ...S.card, textAlign: "center", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>
                No venue record data available for this ground.
              </div>
            )}
          </div>
        )}

        {/* Tab: Bat / Chase */}
        {tab === "mode" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                🏏 When {t1.short} bats first ({h2h.field.n} times)
              </div>
              <WinBar t1={t1code} t2={t2code} t1wins={h2h.field.t1} t2wins={h2h.field.t2} total={h2h.field.n} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
                {t1.short} defends {Math.round((h2h.field.t1 / Math.max(h2h.field.n, 1)) * 100)}% · {t2.short} chases {Math.round((h2h.field.t2 / Math.max(h2h.field.n, 1)) * 100)}%
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", marginBottom: 10 }}>
                🎯 When {t1.short} chases ({h2h.chase.n} times)
              </div>
              <WinBar t1={t1code} t2={t2code} t1wins={h2h.chase.t1} t2wins={h2h.chase.t2} total={h2h.chase.n} />
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
                {t1.short} chases {Math.round((h2h.chase.t1 / Math.max(h2h.chase.n, 1)) * 100)}% · {t2.short} defends {Math.round((h2h.chase.t2 / Math.max(h2h.chase.n, 1)) * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

/* ============================================================
   POINTS TABLE
   ============================================================ */
function PointsTable() {
  const standings = useMemo(() => computeStandings(), []);
  return (
    <div>
      <p style={{ ...S.muted, marginBottom: 18, fontSize: 12 }}>League stage complete · May 24, 2026 · Top 4 qualified for playoffs</p>
      <div style={{ ...S.card, padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ background: "rgba(255,255,255,0.04)" }}>
              {["#", "Team", "P", "W", "L", "Pts", "NRR"].map(h => (
                <th key={h} style={{ padding: "11px 14px", textAlign: h === "Team" ? "left" : "center", ...S.label, fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => (
              <tr key={row.team} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: i < 4 ? `${TEAMS[row.team].primary}08` : "transparent" }}>
                <td style={{ padding: "13px 14px", textAlign: "center", fontWeight: 700, color: i < 4 ? "#FF6B00" : "rgba(255,255,255,0.35)" }}>{i + 1}</td>
                <td style={{ padding: "13px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <TeamBadge code={row.team} size={30} />
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#fff" }}>{TEAMS[row.team].short}</div>
                      <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{TEAMS[row.team].captain.split(" ").slice(-1)[0]}</div>
                    </div>
                  </div>
                </td>
                {[row.p, row.w, row.l].map((v, j) => (
                  <td key={j} style={{ padding: "13px 14px", textAlign: "center", color: "rgba(255,255,255,0.55)" }}>{v}</td>
                ))}
                <td style={{ padding: "13px 14px", textAlign: "center", fontWeight: 800, fontSize: 16, color: "#fff" }}>{row.pts}</td>
                <td style={{ padding: "13px 14px", textAlign: "center", fontSize: 12, fontWeight: 700, color: parseFloat(row.nrr) > 0 ? "#4ade80" : "#f87171" }}>
                  {parseFloat(row.nrr) > 0 ? "+" : ""}{row.nrr}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", fontSize: 11, color: "rgba(255,255,255,0.3)", display: "flex", gap: 16 }}>
          <span><span style={{ color: "#FF6B00", fontWeight: 700 }}>Orange rank</span> = playoff position</span>
          <span>NRR is approximate for early-stage table</span>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   APP ROOT
   ============================================================ */
export default function App() {
  const [view, setView] = useState("teams");
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleNav = (v) => { setView(v); setSelectedTeam(null); setSelectedMatch(null); };

  return (
    <div style={S.page}>
      {/* Sticky header */}
      <div style={{ ...S.header, position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(12px)" }}>
        <div style={S.headerInner}>
          <div style={S.logo}>🏏</div>
          <div>
            <div style={S.logoText}>TATA IPL 2026</div>
            <div style={S.logoSub}>19th Edition · Mar 28 – May 31</div>
          </div>
          <div style={S.badge}>🏆 Final: GT vs RCB · Live</div>
        </div>
      </div>

      <div style={S.container}>
        {/* Nav */}
        <div style={S.nav}>
          {[["teams", "Teams"], ["schedule", "Schedule & Results"], ["points", "Points Table"]].map(([id, label]) => (
            <button key={id} onClick={() => handleNav(id)} style={S.navBtn(view === id)}
              onMouseEnter={e => { if (view !== id) e.currentTarget.style.color = "rgba(255,255,255,0.85)"; }}
              onMouseLeave={e => { if (view !== id) e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
            >{label}</button>
          ))}
        </div>

        {/* Content */}
        <div style={{ paddingRight: selectedMatch ? 0 : 0 }}>
          {view === "teams" && (
            selectedTeam
              ? <TeamDetail code={selectedTeam} onBack={() => setSelectedTeam(null)} />
              : <TeamsView onSelect={setSelectedTeam} />
          )}
          {view === "schedule" && <ScheduleView onMatchClick={setSelectedMatch} />}
          {view === "points" && <PointsTable />}
        </div>
      </div>

      {/* H2H slide panel */}
      {selectedMatch && <H2HPanel match={selectedMatch} onClose={() => setSelectedMatch(null)} />}
    </div>
  );
}
