-- CreateTable
CREATE TABLE "patient" (
    "gender" SMALLINT NOT NULL,
    "marital_status" SMALLINT NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "patient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "patient_id_key" ON "patient"("id");

-- AddForeignKey
ALTER TABLE "patient" ADD CONSTRAINT "patient_id_fkey" FOREIGN KEY ("id") REFERENCES "person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
