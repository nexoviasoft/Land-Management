"use client";

import { useState } from "react";
import {
  useGetDeletedUsersQuery,
  useGetDeletedNoticesQuery,
  useGetDeletedLandDocsQuery,
  useRecoverUserMutation,
  useRecoverNoticeMutation,
  useRecoverLandDocMutation,
  usePermanentlyDeleteUserMutation,
  usePermanentlyDeleteNoticeMutation,
  usePermanentlyDeleteLandDocMutation,
} from "@/redux/api/trashApiSlice";
import {
  Trash2,
  RotateCcw,
  User,
  MessageSquare,
  FileText,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { format } from "date-fns";
import toast from "react-hot-toast";

type Tab = "users" | "notices" | "landdocs";
type ActionType = "delete" | "recover" | null;
type ItemType = "user" | "notice" | "landdoc" | null;

export default function TrashPage() {
  const [activeTab, setActiveTab] = useState<Tab>("users");

  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    action: ActionType;
    type: ItemType;
    id: string;
  }>({
    isOpen: false,
    action: null,
    type: null,
    id: ""
  });

  const { data: usersData, isLoading: isLoadingUsers, refetch: refetchUsers } = useGetDeletedUsersQuery(undefined, { skip: activeTab !== "users" });
  const { data: noticesData, isLoading: isLoadingNotices, refetch: refetchNotices } = useGetDeletedNoticesQuery(undefined, { skip: activeTab !== "notices" });
  const { data: landdocsData, isLoading: isLoadingLanddocs, refetch: refetchLandDocs } = useGetDeletedLandDocsQuery(undefined, { skip: activeTab !== "landdocs" });

  const [recoverUser, { isLoading: isRecoveringUser }] = useRecoverUserMutation();
  const [recoverNotice, { isLoading: isRecoveringNotice }] = useRecoverNoticeMutation();
  const [recoverLandDoc, { isLoading: isRecoveringLanddoc }] = useRecoverLandDocMutation();

  const [permanentlyDeleteUser, { isLoading: isDeletingUser }] = usePermanentlyDeleteUserMutation();
  const [permanentlyDeleteNotice, { isLoading: isDeletingNotice }] = usePermanentlyDeleteNoticeMutation();
  const [permanentlyDeleteLandDoc, { isLoading: isDeletingLanddoc }] = usePermanentlyDeleteLandDocMutation();

  const handleRecoverClick = (type: ItemType, id: string) => {
    setModalState({ isOpen: true, action: "recover", type, id });
  };

  const handleDeleteClick = (type: ItemType, id: string) => {
    setModalState({ isOpen: true, action: "delete", type, id });
  };

  const handleConfirmAction = async () => {
    const { action, type, id } = modalState;
    if (!action || !type || !id) return;
    
    try {
      if (action === "delete") {
        if (type === "user") {
          await permanentlyDeleteUser(id).unwrap();
          refetchUsers();
        } else if (type === "notice") {
          await permanentlyDeleteNotice(id).unwrap();
          refetchNotices();
        } else if (type === "landdoc") {
          await permanentlyDeleteLandDoc(id).unwrap();
          refetchLandDocs();
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} permanently deleted`);
      } else if (action === "recover") {
        if (type === "user") {
          await recoverUser(id).unwrap();
          refetchUsers();
        } else if (type === "notice") {
          await recoverNotice(id).unwrap();
          refetchNotices();
        } else if (type === "landdoc") {
          await recoverLandDoc(id).unwrap();
          refetchLandDocs();
        }
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} recovered successfully`);
      }
    } catch (error: any) {
      toast.error(error?.data?.message || `Failed to ${action} ${type}`);
    } finally {
      setModalState({ isOpen: false, action: null, type: null, id: "" });
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecoverClick("user", user.id)}
                    disabled={isRecoveringUser || isDeletingUser}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <RotateCcw size={16} /> Recover
                  </button>
                  <button
                    onClick={() => handleDeleteClick("user", user.id)}
                    disabled={isRecoveringUser || isDeletingUser}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecoverClick("notice", notice.id)}
                    disabled={isRecoveringNotice || isDeletingNotice}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <RotateCcw size={16} /> Recover
                  </button>
                  <button
                    onClick={() => handleDeleteClick("notice", notice.id)}
                    disabled={isRecoveringNotice || isDeletingNotice}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
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
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRecoverClick("landdoc", doc.id)}
                    disabled={isRecoveringLanddoc || isDeletingLanddoc}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-lg font-medium hover:bg-emerald-100 transition-colors"
                  >
                    <RotateCcw size={16} /> Recover
                  </button>
                  <button
                    onClick={() => handleDeleteClick("landdoc", doc.id)}
                    disabled={isRecoveringLanddoc || isDeletingLanddoc}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-colors"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
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

      {/* Confirmation Modal */}
      {modalState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  {modalState.action === "delete" ? (
                    <><Trash2 className="text-rose-500 w-5 h-5" /> Delete {modalState.type}</>
                  ) : (
                    <><RotateCcw className="text-emerald-500 w-5 h-5" /> Recover {modalState.type}</>
                  )}
                </h3>
                <button
                  onClick={() => setModalState({ isOpen: false, action: null, type: null, id: "" })}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-slate-600 mb-6">
                {modalState.action === "delete"
                  ? "Are you sure you want to permanently delete this item? This action cannot be undone."
                  : "Are you sure you want to recover this item? It will be restored to its active state."}
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setModalState({ isOpen: false, action: null, type: null, id: "" })}
                  className="px-4 py-2 text-slate-600 font-semibold bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  disabled={
                    isDeletingUser ||
                    isDeletingNotice ||
                    isDeletingLanddoc ||
                    isRecoveringUser ||
                    isRecoveringNotice ||
                    isRecoveringLanddoc
                  }
                  className={`px-4 py-2 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors shadow-sm ${
                    modalState.action === "delete"
                      ? "bg-rose-500 hover:bg-rose-600 shadow-rose-500/20"
                      : "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20"
                  } disabled:opacity-50`}
                >
                  {(isDeletingUser || isDeletingNotice || isDeletingLanddoc || isRecoveringUser || isRecoveringNotice || isRecoveringLanddoc) && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {modalState.action === "delete" ? "Permanently Delete" : "Recover Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
