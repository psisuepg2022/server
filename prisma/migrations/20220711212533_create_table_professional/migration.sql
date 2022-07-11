-- CreateTable
CREATE TABLE "professional" (
    "profession" VARCHAR(255) NOT NULL,
    "specialization" VARCHAR(255),
    "base_duration" INTEGER NOT NULL DEFAULT 60,
    "registry" VARCHAR(255) NOT NULL,
    "id" UUID NOT NULL,

    CONSTRAINT "professional_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professional_id_key" ON "professional"("id");

-- AddForeignKey
ALTER TABLE "professional" ADD CONSTRAINT "professional_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
