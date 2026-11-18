const activities = {
  robotics: {
    activity: "Robotics",
    day: "Tuesday",
    time: "16:00",
    room: "Lab 2",
  },
  astronomy: {
    activity: "Astronomy",
    day: "Thursday",
    time: "17:00",
    room: "Science room",
  },
  music: { activity: "Music", day: "Wednesday", time: "15:30", room: "Studio" },
};

export function lookupActivity(activity) {
  if (!Object.hasOwn(activities, activity))
    throw new Error("Choose robotics, astronomy, or music.");
  const result = activities[activity];
  return { ...result };
}
