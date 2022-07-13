-- CreateTable
CREATE TABLE "schedule_lock" (
    "id" UUID NOT NULL,
    "start_time" TIME NOT NULL,
    "end_time" TIME NOT NULL,
    "date" DATE NOT NULL,
    "professional_id" UUID NOT NULL,

    CONSTRAINT "schedule_lock_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "schedule_lock" ADD CONSTRAINT "schedule_lock_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
