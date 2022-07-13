-- CreateTable
CREATE TABLE "appointment" (
    "id" UUID NOT NULL,
    "status" SMALLINT NOT NULL,
    "appointment_date" TIMESTAMP NOT NULL,
    "updated_at" TIMESTAMP NOT NULL,
    "created_at" TIMESTAMP NOT NULL,
    "comments" TEXT NOT NULL,
    "patient_id" UUID NOT NULL,
    "professional_id" UUID NOT NULL,
    "employee_id" UUID NOT NULL,

    CONSTRAINT "appointment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointment" ADD CONSTRAINT "appointment_professional_id_fkey" FOREIGN KEY ("professional_id") REFERENCES "professional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
