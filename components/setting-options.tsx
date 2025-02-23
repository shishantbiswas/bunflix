"use client"

import { indexDB } from "@/lib/index-db";
import { useLiveQuery } from "dexie-react-hooks";
import { ChangeEvent } from "react";

export default function SettingsOptions() {

  const settings = useLiveQuery(() => indexDB.userPreferences.get(1))
  if (!settings) {
    return
  }

  const hideWatchedVideoToogle = () => {
    indexDB.userPreferences.update(1, {
      hideWatchedShows: !settings?.hideWatchedShows
    })
  }

  const hideWatchedVideoInSearchToogle = () => {
    indexDB.userPreferences.update(1, {
      hideWatchedShowsInSearch: !settings?.hideWatchedShowsInSearch
    })
  }

  const changeLanguagePriority = (e: ChangeEvent<HTMLSelectElement>) => {
    indexDB.userPreferences.update(1, {
      lang: e.target.value as "all" || "en" || "jp"
    })
  }

  const setContentCenter = () => {
    indexDB.userPreferences.update(1, {
      centerContent: !settings?.centerContent
    })
  }

  const disableFloaitngNavbar = () => {
    indexDB.userPreferences.update(1, {
      disableFloatingNavbar: !settings?.disableFloatingNavbar
    })
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col justify-between gap-6 mt-12">
        <div className="flex justify-between">
          <div >
            <p className="text-lg font-semibold">Hide Watched Shows</p>
            <label className="opacity-70 text-sm">Only works for anime for now</label>
          </div>
          {settings && <input
            type="checkbox"
            defaultChecked={settings.hideWatchedShows}
            onClick={hideWatchedVideoToogle}
            className="size-6 accent-red-500" />}
        </div>

        <div className="flex justify-between">
          <div >
            <p className="text-lg font-semibold">Hide Watched Shows (In Search)</p>
            <label className="opacity-70 text-sm">Hide watched shows/movies in anime search</label>
          </div>
          {settings && <input
            type="checkbox"
            defaultChecked={settings.hideWatchedShowsInSearch}
            onClick={hideWatchedVideoInSearchToogle}
            className="size-6 accent-red-500" />}
        </div>

        <div className="flex justify-between">
          <div >
            <p className="text-lg font-semibold">Center UI</p>
            <label className="opacity-70 text-sm">Make the UI center focused instead of full width (only effect desktop UI)</label>
          </div>
          {settings && <input
            type="checkbox"
            defaultChecked={settings.centerContent}
            onClick={setContentCenter}
            className="size-6 accent-red-500" />}
        </div>

        <div className="flex justify-between">
          <div >
            <p className="text-lg font-semibold">Disable Floating Navbar</p>
            <label className="opacity-70 text-sm">Disable floating navbar on scroll</label>
          </div>
          {settings && <input
            type="checkbox"
            defaultChecked={settings.disableFloatingNavbar}
            onClick={disableFloaitngNavbar}
            className="size-6 accent-red-500" />}
        </div>



        <div className="flex justify-between">
          <div >
            <p className="text-lg font-semibold">Priority Language</p>
            <label className="opacity-70 text-sm">Prioritize language, only works for anime for now</label>
          </div>
          {settings && <select onChange={changeLanguagePriority} defaultValue={settings.lang}>
            <option value="en">English</option>
            <option value="jp">Japanese</option>
            <option value="all">Don&apos;t Prioritize</option>
          </select>}
        </div>
      </div>
    </div>
  )
}