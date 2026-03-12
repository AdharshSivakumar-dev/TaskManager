from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth, database

router = APIRouter()

@router.get("/notifications", response_model=dict)
def get_notifications(db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    notifications = db.query(models.Notification).filter(models.Notification.user_id == current_user.id).order_by(models.Notification.created_at.desc()).all()
    
    unread_count = db.query(models.Notification).filter(
        models.Notification.user_id == current_user.id,
        models.Notification.is_read == False
    ).count()

    # Convert to Pydantic models for serialization
    notif_list = [schemas.NotificationOut.from_orm(n) for n in notifications]

    return {
        "notifications": notif_list,
        "unread_count": unread_count
    }

@router.put("/notifications/mark-read", response_model=dict)
def mark_notifications_read(data: schemas.NotificationMarkRead, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    updated_count = db.query(models.Notification).filter(
        models.Notification.id.in_(data.notification_ids),
        models.Notification.user_id == current_user.id
    ).update({"is_read": True}, synchronize_session=False)
    
    db.commit()
    return {"message": "Notifications marked as read", "updated": updated_count}

@router.put("/notifications/{notification_id}/read", response_model=schemas.NotificationOut)
def read_notification(notification_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    notification.is_read = True
    db.commit()
    db.refresh(notification)
    return notification

@router.delete("/notifications/{notification_id}")
def delete_notification(notification_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    notification = db.query(models.Notification).filter(models.Notification.id == notification_id).first()
    
    if not notification:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Notification not found")
        
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
        
    db.delete(notification)
    db.commit()
    return {"message": "Notification deleted"}
