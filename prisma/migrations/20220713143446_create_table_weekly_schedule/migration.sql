-- CreateTable
CREATE TABLE "weekly_schedule" (
    "id" UUID NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "day_of_the_week" SMALLINT NOT NULL,
    "professional_id" UUID NOT NULL,

    CONSTRAINT "weekly_schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "weekly_schedule" ADD CONSTRAINT "weekly_schedule_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
