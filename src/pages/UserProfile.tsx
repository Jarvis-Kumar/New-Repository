import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// ====== Types ======
type Dataset = {
  id: string;
  title: string;
  type:
    | "Image"
    | "Video"
    | "Audio"
    | "Text"
    | "Mixed"
    | "Document"
    | "Code"
    | "3D Model"
    | "3D Printing"
    | "Fashion"
    | "Product Design"
    | "File";
  downloads: number;
  likes: number;
  rating: number;
  previewColor?: string;
};

type TeamMember = {
  id: string;
  name: string;
  role: "Owner" | "Admin" | "Member";
  avatarColor: string;
};

type Team = {
  id: string;
  name: string;
  members: TeamMember[];
};

// ====== Mock Data ======
const mockDatasets: Dataset[] = [
  {
    id: "d1",
    title: "Sunset Preset Pack",
    type: "Image",
    downloads: 12500,
    likes: 980,
    rating: 4.8,
    previewColor: "from-pink-500 to-purple-500",
  },
  {
    id: "d2",
    title: "Film LUTs v2",
    type: "Video",
    downloads: 8200,
    likes: 650,
    rating: 4.6,
    previewColor: "from-emerald-400 to-teal-500",
  },
  {
    id: "d3",
    title: "Podcast Clean Kit",
    type: "Document",
    downloads: 4100,
    likes: 290,
    rating: 4.4,
    previewColor: "from-yellow-400 to-orange-400",
  },
];

// ====== 4 Teams for Testing ======
const mockTeams: Team[] = [
  {
    id: "team1",
    name: "Design Wizards",
    members: [
      { id: "t1", name: "Dinesh Kumar", role: "Owner", avatarColor: "bg-purple-500" },
      { id: "t2", name: "Alex Morgan", role: "Admin", avatarColor: "bg-blue-500" },
      { id: "t3", name: "Sofia Lee", role: "Member", avatarColor: "bg-green-500" },
    ],
  },
  {
    id: "team2",
    name: "Creative Coders",
    members: [
      { id: "t1", name: "Dinesh Kumar", role: "Owner", avatarColor: "bg-purple-500" },
      { id: "t4", name: "John Smith", role: "Admin", avatarColor: "bg-red-500" },
      { id: "t5", name: "Emma Stone", role: "Admin", avatarColor: "bg-pink-500" },
    ],
  },
  {
    id: "team3",
    name: "Pixel Artists",
    members: [
      { id: "t1", name: "Dinesh Kumar", role: "Owner", avatarColor: "bg-purple-500" },
      { id: "t6", name: "Liam Brown", role: "Admin", avatarColor: "bg-yellow-500" },
      { id: "t7", name: "Olivia Green", role: "Member", avatarColor: "bg-teal-500" },
    ],
  },
  {
    id: "team4",
    name: "AI Innovators",
    members: [
      { id: "t1", name: "Dinesh Kumar", role: "Owner", avatarColor: "bg-purple-500" },
      { id: "t8", name: "Noah White", role: "Admin", avatarColor: "bg-orange-500" },
      { id: "t9", name: "Ava Black", role: "Member", avatarColor: "bg-blue-400" },
    ],
  },
];

export default function DesignPlatformPages() {
  const [tab, setTab] = useState<"profile" | "create" | "settings">("profile");

  return (
    <div className="min-h-screen font-bold bg-gradient-to-b from-[#0f1724] to-[#111827] text-white p-10">
      <nav className="max-w-6xl mx-auto flex gap-4 items-center mb-6">
        <div className="text-2xl font-bold">⚡ AlgoEdit</div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setTab("profile")}
            className={`px-4 py-2 rounded-lg ${
              tab === "profile"
                ? "bg-gradient-to-r from-indigo-600 to-purple-600"
                : "bg-white/6"
            }`}
          >
            Profile
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto">
        {tab === "profile" && (
          <ProfilePage
            datasets={mockDatasets}
            initialTeams={mockTeams}
            currentUserId="t1"
          />
        )}
      </main>
    </div>
  );
}

function ProfilePage({
  datasets,
  initialTeams,
  currentUserId,
}: {
  datasets: Dataset[];
  initialTeams: Team[];
  currentUserId: string;
}) {
  const navigate = useNavigate();

  const DEV_ALLOW_ROLE_EDIT_ANY_TEAM = true;

  const [filter, setFilter] = useState<"All" | "Image" | "Video" | "Document">("All");
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [liveDatasets, setLiveDatasets] = useState<Dataset[]>(datasets);

  const totalEarnings = 12450.75;
  const totalSales = 358;
  const followers = 12500;

  const currentUserName =
    initialTeams.find((t) => t.members.some((m) => m.id === currentUserId))
      ?.members.find((m) => m.id === currentUserId)?.name ?? "??";

  const apiRemoveMember = async (teamId: string, id: string) => {
    console.log(`API: Remove member ${id} from team ${teamId}`);
  };

  const apiChangeRole = async (
    teamId: string,
    id: string,
    newRole: TeamMember["role"]
  ) => {
    console.log(`API: Change role for ${id} in ${teamId} to ${newRole}`);
  };

  const apiLeaveTeam = async (teamId: string, id: string) => {
    console.log(`API: Member ${id} left team ${teamId}`);
  };

  const userRoleInTeam = (team: Team) =>
    team.members.find((m) => m.id === currentUserId)?.role;

  const canManageTeam = (team: Team) =>
    DEV_ALLOW_ROLE_EDIT_ANY_TEAM || userRoleInTeam(team) === "Owner";

  const removeMember = async (teamId: string, id: string) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    if (!canManageTeam(team)) return;

    await apiRemoveMember(teamId, id);
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? { ...t, members: t.members.filter((m) => m.id !== id) }
          : t
      )
    );
  };

  const addMember = () => {
    navigate("/marketplace");
  };

  const changeRole = async (
    teamId: string,
    id: string,
    newRole: TeamMember["role"]
  ) => {
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;

    if (!canManageTeam(team)) return;

    

    await apiChangeRole(teamId, id, newRole);
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId
          ? {
              ...t,
              members: t.members.map((m) =>
                m.id === id ? { ...m, role: newRole } : m
              ),
            }
          : t
      )
    );
  };

  const leaveTeam = async (teamId: string) => {
    await apiLeaveTeam(teamId, currentUserId);
    setTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  const requestToJoin = () => {
    navigate("/marketplace");
  };

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl p-6 flex items-center gap-6 shadow-lg shadow-purple-500/10">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold ring-4 ring-purple-500/30 ">
          {currentUserName.slice(0, 2)}
        </div>
        <div className="flex-1">
          <div className="text-2xl font-extrabold tracking-wide">
            {currentUserName}
          </div>
          <div className="text-sm text-white/70">Your personal profile dashboard.</div>
          <div className="mt-4 flex gap-6">
            <div className="text-center">
              <strong className="text-lg">{followers.toLocaleString()}</strong>
              <div className="text-xs text-white/60">Followers</div>
            </div>
            <div className="text-center">
              <strong className="text-lg">{datasets.length}</strong>
              <div className="text-xs text-white/60">Datasets</div>
            </div>
            <div className="text-center">
              <strong className="text-lg">1.2k</strong>
              <div className="text-xs text-white/60">Following</div>
            </div>
          </div>
        </div>
      </div>

      {/* Always-visible Private Dashboard */}
      <section className="space-y-6">
        <h3 className="text-xl font-semibold">Private Dashboard</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <PrivateCard title="Total Earnings" value={`$${totalEarnings.toFixed(2)}`} />
          <PrivateCard title="Total Sales" value={`${totalSales}`} />
          <PrivateCard title="Likes / Upvotes" value="12.5k" />
          <PrivateCard title="Conversion Rate" value="8.5%" />
        </div>
      </section>

      {/* Published Datasets */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Published Datasets</h3>
          <div className="flex gap-2">
            {["All", "Image", "Video", "Document"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type as typeof filter)}
                className={`px-3 py-1 rounded-md text-sm transition-colors ${
                  filter === type
                    ? "bg-purple-500 text-white"
                    : "bg-white/5 hover:bg-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets
            .filter((d) => filter === "All" || d.type === filter)
            .map((d) => (
              <DatasetCard key={d.id} d={d} />
            ))}
        </div>
      </section>

      {/* Teams Section */}
      {teams.length > 0 ? (
        teams.map((team) => {
          const canManage = canManageTeam(team);
          return (
            <section key={team.id} className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">{team.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={addMember}
                    className="px-3 py-1 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm"
                  >
                    + Invite Member
                  </button>
                  <button
                    onClick={() => leaveTeam(team.id)}
                    className="px-3 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm"
                  >
                    Leave Team
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members.map((member) => (
                  <div
                    key={`${team.id}-${member.id}`}
                    className="flex items-center justify-between bg-white/5 p-4 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full ${member.avatarColor} flex items-center justify-center text-white font-bold`}
                      >
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold flex items-center gap-2">
                          {member.name}
                          <span className="text-xs text-gray-300">
                            ({member.role})
                          </span>
                        </div>
                        {canManage && (
                          <select
                            value={member.role}
                            onChange={(e) =>
                              changeRole(
                                team.id,
                                member.id,
                                e.target.value as TeamMember["role"]
                              )
                            }
                            className="bg-black text-white text-sm rounded mt-2 px-2 py-1"
                            
                          >
                            <option>Owner</option>
                            <option>Admin</option>
                            <option>Member</option>
                          </select>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {/* Remove button only for Admin and Member */}
                      {canManage && member.role !== "Owner" && (
                        <button
                          onClick={() => removeMember(team.id, member.id)}
                          className="text-red-400 hover:text-red-500 text-sm"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })
      ) : (
        <section className="space-y-4 text-center">
          <p className="text-white/70">You are not part of any team right now.</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={requestToJoin}
              className="px-4 py-2 bg-purple-500 rounded-md hover:bg-purple-600 text-white"
            >
              Request to Join a Team
            </button>
            <button
              onClick={addMember}
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 text-white"
            >
              + Invite Member
            </button>
          </div>
        </section>
      )}
    </div>
  );
}

// ====== Dataset Card ======
function DatasetCard({ d }: { d: Dataset }) {
  return (
    <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-white/3 to-white/6 hover:scale-[1.02] transition-transform duration-300 shadow-md shadow-black/10">
      <div
        className={`h-36 flex items-end p-4 bg-gradient-to-br ${
          d.previewColor ?? "from-slate-600 to-slate-700"
        }`}
      >
        <div className="bg-white/10 px-3 py-1 rounded-md text-xs">{d.type}</div>
      </div>
      <div className="p-4">
        <div className="font-semibold text-lg">{d.title}</div>
        <div className="flex items-center justify-between mt-3 text-sm text-white/70">
          <div>{d.downloads.toLocaleString()} downloads</div>
          <div className="flex items-center gap-2">⭐ {d.rating}</div>
        </div>
      </div>
    </div>
  );
}

// ====== Private Card ======
function PrivateCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-gradient-to-br from-white/3 to-white/6 rounded-2xl p-6">
      <div className="text-sm text-white/70">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}
