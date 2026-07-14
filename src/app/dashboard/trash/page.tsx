"use client";

import { useState } from "react";
import {
  useGetDeletedUsersQuery,
  useGetDeletedNoticesQuery,
  useGetDeletedLandDocsQuery,
  useRecoverUserMutation,
  useRecoverNoticeMutation,
  useRecoverLandDocMutation,
} from "@/redux/api/trashApiSlice";
import {
  Trash2,
  RotateCcw,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type Tab = "users" | "notices" | "landdocs";

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState<Tab>("users");

  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetDeletedUsersQuery(undefined, { skip: activeTab !== "users" });
  const { data: noticesData, isLoading: isLoadingNotices, refetch: refetchNotices } = useGetDeletedNoticesQuery(undefined, { skip: activeTab !== "notices" });
  const { data: landdocsData, isLoading: isLoadingLanddocs, refetch: refetchLandDocs } = useGetDeletedLandDocsQuery(undefined, { skip: activeTab !== "landdocs" });

  const [recoverUser, { isLoading: isRecoveringUser }] = useRecoverUserMutation();
  const [recoverNotice, { isLoading: isRecoveringNotice }] = useRecoverNoticeMutation();
  const [recoverLandDoc, { isLoading: isRecoveringLanddoc }] = useRecoverLandDocMutation();

  const handleRecoverUser = async (id: string) => {
    try {
      await recoverUser(id).unwrap();
      toast.success("User recovered successfully");
      refetchUsers();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to recover user");
    }
  };

  const handleRecoverNotice = async (id: string) => {
    try {
      await recoverNotice(id).unwrap();
      toast.success("Notice recovered successfully");
      refetchNotices();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to recover notice");
    }
  };

  const handleRecoverLandDoc = async (id: string) => {
    try {
      await recoverLandDoc(id).unwrap();
      toast.success("Land document recovered successfully");
      refetchLandDocs();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to recover land document");
    }
  };

  const calculateDaysLeft = (deletedAt: string) => {
    const deletedDate = new Date(deletedAt);
    const deletionDate = new Date(deletedDate.setDate(deletedDate.getDate() + 30));
    const today = new Date();
    const diffTime = Math.abs(deletionDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderTabs = () => (
    <div className="flex space-x-2 border-b border-slate-200 mb-6">
      <button
        onClick={() => setActiveTab("users")}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "users"
            ? "border-brand-orange text-brand-orange"
            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
        }`}
      >
        <User size={18} />
        Users
      </button>
      <button
        onClick={() => setActiveTab("notices")}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "notices"
            ? "border-brand-orange text-brand-orange"
            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
        }`}
      >
        <MessageSquare size={18} />
        Notices
      </button>
      <button
        onClick={() => setActiveTab("landdocs")}
        className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
          activeTab === "landdocs"
            ? "border-brand-orange text-brand-orange"
            : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"
        }`}
      >
        <FileText size={18} />
        Land Documents
      </button>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "users") {
      if (isLoadingUsers) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-orange" size={24} /></div>;
      const users = usersData?.data || [];
      return (
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No users in trash.</div>
          ) : (
            users.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div>
                  <h4 className="font-semibold text-slate-800">{user.name}</h4>
                  <p className="text-sm text-slate-500">{user.email} • {user.role}</p>
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Deleted on {format(new Date(user.deletedAt), 'PP')} ({calculateDaysLeft(user.deletedAt)} days left until permanent deletion)
                  </p>
                </div>
                <button
                  onClick={() => handleRecoverUser(user.id)}
                  disabled={isRecoveringUser}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw size={16} /> Recover
                </button>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === "notices") {
      if (isLoadingNotices) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-orange" size={24} /></div>;
      const notices = noticesData?.data || [];
      return (
        <div className="space-y-4">
          {notices.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No notices in trash.</div>
          ) : (
            notices.map((notice: any) => (
              <div key={notice.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div>
                  <h4 className="font-semibold text-slate-800">{notice.title}</h4>
                  <p className="text-sm text-slate-500 line-clamp-1">{notice.content}</p>
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Deleted on {format(new Date(notice.deletedAt), 'PP')} ({calculateDaysLeft(notice.deletedAt)} days left)
                  </p>
                </div>
                <button
                  onClick={() => handleRecoverNotice(notice.id)}
                  disabled={isRecoveringNotice}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw size={16} /> Recover
                </button>
              </div>
            ))
          )}
        </div>
      );
    }

    if (activeTab === "landdocs") {
      if (isLoadingLanddocs) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-brand-orange" size={24} /></div>;
      const landdocs = landdocsData?.data || [];
      return (
        <div className="space-y-4">
          {landdocs.length === 0 ? (
            <div className="text-center py-10 text-slate-500">No land documents in trash.</div>
          ) : (
            landdocs.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl shadow-sm">
                <div>
                  <h4 className="font-semibold text-slate-800">
                    Khatian: {doc.landDetails.khatianNo} | Dag: {doc.landDetails.dagNo}
                  </h4>
                  <p className="text-sm text-slate-500">
                    {doc.location.mouza}, {doc.location.upazila}, {doc.location.district}
                  </p>
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={12} /> Deleted on {format(new Date(doc.deletedAt), 'PP')} ({calculateDaysLeft(doc.deletedAt)} days left)
                  </p>
                </div>
                <button
                  onClick={() => handleRecoverLandDoc(doc.id)}
                  disabled={isRecoveringLanddoc}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                >
                  <RotateCcw size={16} /> Recover
                </button>
              </div>
            ))
          )}
        </div>
      );
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Trash2 className="text-brand-orange" />
            Trash Bin
          </h1>
          <p className="text-slate-500 mt-1">
            Items here will be permanently deleted after 30 days. You can recover them before that.
          </p>
        </div>
      </div>

      {renderTabs()}
      {renderContent()}
    </div>
  );
}
