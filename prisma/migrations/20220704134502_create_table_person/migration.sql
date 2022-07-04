-- CreateTable
CREATE TABLE "person" (
    "id" UUID NOT NULL,
    "email" VARCHAR(100),
    "name" VARCHAR(100) NOT NULL,
    "class" VARCHAR(32) NOT NULL,
    "cpf" VARCHAR(16) NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "contact_number" VARCHAR(32),
    "clinic_id" UUID NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- AddForeignKey
ALTER TABLE "person" ADD CONSTRAINT "person_clinic_id_fkey" FOREIGN KEY ("clinic_id") REFERENCES "clinic"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
