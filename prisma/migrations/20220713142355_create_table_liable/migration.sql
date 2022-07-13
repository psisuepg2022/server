-- CreateTable
CREATE TABLE "liable" (
    "person_id" UUID NOT NULL,
    "patient_id" UUID NOT NULL,

    CONSTRAINT "liable_pkey" PRIMARY KEY ("person_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "liable_person_id_key" ON "liable"("person_id");

-- AddForeignKey
ALTER TABLE "liable" ADD CONSTRAINT "liable_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liable" ADD CONSTRAINT "liable_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
