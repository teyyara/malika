export const messageCategories = [
  { id: "all", label: "Everything" },
  { id: "reasons", label: "Little reasons" },
  { id: "adore", label: "Things I adore" },
  { id: "memories", label: "Our memories" },
  { id: "wishes", label: "Birthday wishes" },
  { id: "secret", label: "Secret letters" }
];

const messages = [
  ["reason-01","reasons","A softer kind of day","Even an ordinary day can feel softer when there is something lovely to look forward to.","start"],
  ["reason-02","reasons","Your kind of magic","Some kinds of magic are quiet: kindness, patience, warmth, and the way someone makes room for others.","start"],
  ["reason-03","reasons","A tiny reminder","You do not have to be extraordinary every minute to be deeply worth celebrating.","start"],
  ["reason-04","reasons","The little things","The details that make you you are not little at all. They are part of your own particular light.","start"],
  ["reason-05","reasons","A heart-shaped thought","You deserve affection that is gentle, sincere, and never something you have to earn by being perfect.","start"],
  ["reason-06","reasons","Permission to rest","You are allowed to pause, take a breath, and let today be enough. You do not have to do everything at once.","start"],
  ["reason-07","reasons","The glow you carry","There is beauty in the way you keep being yourself, even when the world asks everyone to be the same.","start"],
  ["reason-08","reasons","A little more joy","I hope this note gives you one small extra reason to smile today. Consider it a pocket-sized hug.","start"],
  ["reason-09","reasons","You are not a checklist","You are more than your plans and progress. You are already worthy, even when a day feels unfinished.","start"],
  ["reason-10","reasons","A wish wrapped in purple","May you always find corners of the world where you can be completely yourself and feel warmly welcomed.","start"],
  ["adore-01","adore","Your gentleness","Gentleness is not weakness. It is a beautiful way to move through a world that can sometimes be loud.","start"],
  ["adore-02","adore","Your smile","I hope your smile gets plenty of reasons to show up today, especially the silly, unexpected ones.","start"],
  ["adore-03","adore","Your own rhythm","I love the idea of you taking life at your own pace, making space for what matters to your heart.","start"],
  ["adore-04","adore","Your resilience","I hope you give yourself credit for the quiet strength it takes to keep growing, learning, and trying again.","start"],
  ["adore-05","adore","Your curiosity","May you never lose the part of you that wonders, notices tiny things, and finds delight in discovering something new.","start"],
  ["adore-06","adore","Your softness","You never need to hide your softness to deserve respect. Tenderness and strength can live in the same heart.","start"],
  ["adore-07","adore","Your becoming","Every version of you deserves patience: who you were, who you are, and who you are still becoming.","start"],
  ["adore-08","adore","Your presence","May you always be surrounded by people who listen with care and make you feel that your words matter.","start"],
  ["wish-01","wishes","A year of gentle surprises","I wish you the sort of surprises that leave your heart lighter and your cheeks hurting from smiling.","start"],
  ["wish-02","wishes","More room to dream","May this year give your dreams a little more room, your courage a little more space, and your worries a little less power.","start"],
  ["wish-03","wishes","Small peaceful moments","I hope you find slow mornings, restful evenings, warm drinks, cozy blankets, and small moments that belong only to you.","start"],
  ["wish-04","wishes","Brave new chapters","When a new door appears, I hope you feel brave enough to open it and kind enough to yourself to change your mind.","start"],
  ["wish-05","wishes","A little more wonder","May there be cats to make you laugh, flowers to notice, ladybugs to surprise you, and purple hearts wherever you need them.","start"],
  ["wish-06","wishes","The right kind of people","I wish you connections that feel honest, safe, joyful, and roomy enough for you to be your whole self.","start"],
  ["wish-07","wishes","A wish for your heart","Above all, I wish you a year that treats your heart gently and reminds you that good things can still find you.","start"],
  ["secret-01","secret","A letter behind the stars","You are worthy of love on your easy days and your difficult ones alike. You never need to earn gentleness by being endlessly strong.","game"],
  ["secret-02","secret","A place to breathe","I hope love always feels like room to breathe: a place where you can be honest, where silence can be comfortable, and where you are never asked to make yourself smaller.","game"],
  ["secret-03","secret","The birthday wish I keep","My birthday wish is that you find courage when you need it, rest when you are tired, help when you ask, and joy in places you did not expect.","game"],
  ["secret-04","secret","A thousand tiny hearts","Imagine every purple heart in this garden as a tiny reminder that care can be shown in a thousand small ways. Remember to be gentle with yourself, too.","game"],
  ["secret-05","secret","One last little truth","In a universe this huge, I hope you never forget that your own little corner of it matters. Your hopes matter. Your joy matters. You matter, very much.","game"]
];

export const loveMessages = messages.map(([id, category, title, text, unlock]) => ({ id, category, title, text, unlock }));
