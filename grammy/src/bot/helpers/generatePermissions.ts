import { ChatPermissions } from 'grammy/types'

export const generatePermissions = (val: boolean): ChatPermissions => {
  return {
    can_manage_topics: val,
    can_send_audios: val,
    can_send_polls: val,
    can_send_videos: val,
    can_send_voice_notes: val,
    can_send_video_notes: val,
    can_send_messages: val,
    can_send_documents: val,
    can_send_photos: val,
    can_add_web_page_previews: val,
  }
}
