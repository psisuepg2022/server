-- CreateTable
CREATE TABLE "weekly_schedule_lock" (
    "id" UUID NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "weekly_schedule_id" UUID NOT NULL,

    CONSTRAINT "weekly_schedule_lock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "weekly_schedule_lock" ADD CONSTRAINT "weekly_schedule_lock_weekly_schedule_id_fkey" FOREIGN KEY ("weekly_schedule_id") REFERENCES "weekly_schedule"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
