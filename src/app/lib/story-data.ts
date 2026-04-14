export type StateSale = {
  name: string;
  sales: number;
};

export type StoryData = {
  headline: string;
  insights: string[];
  bulletPoints: string[];
  states: StateSale[];
};

export const storyData: StoryData = {
  headline: 'Maharashtra Leads National Sales, Northern States Show Growth Potential',
  insights: [
    'This week\'s data reveals a strong performance in the western region, with Maharashtra continuing its dominance in national sales. The state\'s robust economic activity and high consumer demand contribute to its number one position. Following Maharashtra, Karnataka in the south also shows significant sales figures, indicating a solid market presence.',
    'Interestingly, the northern states, while having lower sales volumes currently, are exhibiting promising growth trajectories. Uttar Pradesh and Rajasthan have shown a quarter-over-quarter increase in sales, hinting at an emerging market that could be a focus for future expansion strategies. In contrast, several states in the eastern region, like Bihar and Odisha, are lagging, presenting a challenge and an opportunity for targeted marketing efforts.',
  ],
  bulletPoints: [
    'Maharashtra accounts for over 20% of total national sales.',
    'Top 5 states contribute to nearly 60% of the revenue.',
    'Eastern region sales are 40% lower than the national average.',
    'Potential for 15% growth in northern states with targeted campaigns.',
  ],
  states: [
    { name: 'Andaman and Nicobar Islands', sales: 10 },
    { name: 'Andhra Pradesh', sales: 80 },
    { name: 'Arunachal Pradesh', sales: 15 },
    { name: 'Assam', sales: 45 },
    { name: 'Bihar', sales: 40 },
    { name: 'Chandigarh', sales: 30 },
    { name: 'Chhattisgarh', sales: 50 },
    { name: 'Dadra and Nagar Haveli and Daman and Diu', sales: 12 },
    { name: 'Delhi', sales: 95 },
    { name: 'Goa', sales: 55 },
    { name: 'Gujarat', sales: 90 },
    { name: 'Haryana', sales: 75 },
    { name: 'Himachal Pradesh', sales: 35 },
    { name: 'Jammu and Kashmir', sales: 25 },
    { name: 'Jharkhand', sales: 48 },
    { name: 'Karnataka', sales: 110 },
    { name: 'Kerala', sales: 85 },
    { name: 'Ladakh', sales: 5 },
    { name: 'Lakshadweep', sales: 2 },
    { name: 'Madhya Pradesh', sales: 65 },
    { name: 'Maharashtra', sales: 120 },
    { name: 'Manipur', sales: 22 },
    { name: 'Meghalaya', sales: 18 },
    { name: 'Mizoram', sales: 20 },
    { name: 'Nagaland', sales: 17 },
    { name: 'Odisha', sales: 42 },
    { name: 'Puducherry', sales: 28 },
    { name: 'Punjab', sales: 70 },
    { name: 'Rajasthan', sales: 68 },
    { name: 'Sikkim', sales: 14 },
    { name: 'Tamil Nadu', sales: 105 },
    { name: 'Telangana', sales: 88 },
    { name: 'Tripura', sales: 19 },
    { name: 'Uttar Pradesh', sales: 98 },
    { name: 'Uttarakhand', sales: 32 },
    { name: 'West Bengal', sales: 72 },
  ],
};
