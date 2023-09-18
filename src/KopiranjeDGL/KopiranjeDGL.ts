

export class KopiranjeDGL {

    private readonly DGL_KOPIRANJE_CODE = `Option Compare Database
    Option Explicit
    
    'dbSystemField zamijenjen s True da bi prošao compile
    
    
    '************** IZ *******************
    'IzSifDV - spisak kolona
    Const IZSDV_SifDV = 0
    Const IZSDV_NazDV = 1
    Const IZSDV_RezORNar = 3 'bio nar!!!
    Const IZSDV_DT = 4
    Const IZSDV_MS = 5
    Const IZSDV_UI = 6
    Const IZSDV_SifIzgledaDGL = 7
    
    'IzBrojDokumenta - spisak kolona
    Const IZBD_DGLID = 0
    Const IZBD_BrojDokumenta = 1
    Const IZBD_DatumDokumenta = 2
    Const IZBD_SifPartnera = 3
    Const IZBD_SifVal = 4
    Const IZBD_Tecaj = 5
    Const IZBD_SifPDVKnjige = 6
    Const IZBD_SifVrOp = 7
    Const IZBD_TipRacuna = 8
    Const IZBD_SifMjTr = 9
    Const IZBD_SifPred = 10
    Const IZBD_PodPred = 11
    Const IZBD_DatumPlacanja = 12
    Const IZBD_Rev = 13
    Const IZBD_SifPodruznice = 14
    Const IZBD_SifPartnera2 = 15
    
    '************* KRAJ IZ *******************
    
    
    
    '***************  U  *******************
    'USifDV - spisak kolona
    Const USDV_USifDV = 0
    Const USDV_NazDV = 1
    Const USDV_SifDV = 2
    Const USDV_NacinNumeracije = 3
    Const USDV_GrupaNumeracije = 4
    Const USDV_FormatBrojaDokumenta = 5
    Const USDV_DevizniDokument = 6
    Const USDV_GrupaKnjiga = 7
    Const USDV_ASkl = 8
    Const USDV_cwSifPoz = 9
    Const USDV_SifIzgledaDGL = 10
    'Const USDV_RezORNar = 11 'bio nar!!
    Const USDV_DefSifPDVKnjige = 12
    Const USDV_DefSifVrOp = 13
    Const USDV_DT = 14
    Const USDV_DefNeASkl = 15
    Const USDV_MS = 16
    Const USDV_UI = 17
    
    'UBrojDokumentaC (combo)
    Const UBDC_DGLID = 0
    Const UBDC_BrojDokumenta = 1
    Const UBDC_DatumDokumenta = 2
    Const UBDC_SifPartnera = 3
    Const UBDC_SifPred = 4
    
    
    '****************  KRAJ U *******************
    
    'FramePoz: TODO
    Const POZ_NEDEF = 1
    Const POZ_DOK = 2
    
    'FrameMjTr
    Const MJTR_DOK = 1
    Const MJTR_KOR = 2
    
    'FrameSkladista
    Const SKL_DOK = 1
    Const SKL_KOR = 2
    
    
    'FrameUDok:
    Const UDOK_NOVI = 1
    Const UDOK_POSTOJECI = 2
    Const UDOK_REV = 3
    
    'FramePredmeti:
    Const PREDMET_POSTOJECI = 1
    Const PREDMET_NOVI = 2
    Const PREDMET_NITIJEDAN = 3
    
    'cboNar
    Const cboNAR_SVE = 1
    Const cboNAR_PREOST = 2
    Const cboNAR_PREOSTISP = 3
    Const cboNAR_PREOSTNEISP = 4
    Const cboNAR_SVEISP = 5
    
    Dim af As Form
    
    Dim NoviPredmet As Boolean
    Dim PredVrstaL As String
    Dim PredVrstaD As String
    Dim NeProvDevDokVal As Boolean
    Dim OdredisniJeStornoIzlaza As Boolean
    Public PozivSaSemafora As Boolean
    Public clsForm As cForm
    
    Dim ZamijeniSklUGlavi As Boolean, KopiSamoSkl As String, SetOznacenuIzvornom As Boolean, SklUvijek As String, Skl2Uvijek As String, BrojDokumentaU As String, DatumDokumentaU As String
    Dim Kol2UKol As Boolean, KopiDosp As Integer, KopiSamoKontr As String, sKopiSamoKontr As String, KopiKontrAKNaSkl As String, KopiDGLRaspPoMjTr As Boolean, KopiDGLNomPod As Boolean
    Dim NeKopirajNapomene As String, StatusOdrDokID As Long, StatusIzvDokID As Long
    Dim PovuciDefaulte As Boolean, ProvjeriOtvorenost As Boolean
    Dim DefNapZaPartUvjetiNabave As String
    Dim DefNapZaPartUvjetiProdaje As String
    Dim UvjeteNabProdUOdrDokIzpart As Boolean
    Dim ChkRequired As Boolean, NeKopirajOznacen As Boolean, PlusUJednako As Boolean, ZabraniKopiranjeZatvDok As Boolean, KopirajPoveznicu As Boolean, NazoviPoveznicuPremaOdredisnom As Boolean
    Dim BezPorukeZaOtvaranjeDok As Boolean, ZakljucajIzvDok As Boolean, ZakljucajOdrDok As Boolean
    Dim SerRaspisi As Boolean, Rezervacije As Boolean
    Dim SifValUSifVal2 As Boolean
    Dim SifVal2USifVal As Boolean
    Dim NeKopirajDGLpolja As String
    Dim Cancel As Boolean, ObaveznoJednaStavkaUDok As Boolean
    Dim FiskalizacijaZaKET As Boolean
    Dim ProvjeraDatumZakZat As String
    Dim ProknjiziOdredisni As Boolean
    Dim PovuciDefaultNapomene As Boolean
    Dim NeKopiSamoSkladZaOper As String
    Dim ZamijeniPartneraUGlavi As Boolean
    Dim Kol3uKol2 As Boolean
    Dim EditModeKopiranogDok As Boolean
    Dim SifSklad2Edit As String
    Dim PovuciDefaulteZa As String ' predat će se stori spDST_PovuciDefaulte i reći joj za koja polja se dohvaćaju default vrijednosti
    Dim StariStatus As String
    Dim KopiDatOpcije As Integer
    Dim KopiranjeDatumCassa As Integer
    Dim KopirajPriloge As Boolean
    Dim KopirajDSTSerBr As Boolean
    Dim ProvjeravajPrekoracenjeDosp As Boolean
    Dim IzvrsiSQL As String
    Dim DodajuWMSPoveznicu As Boolean
    Dim RaspisiPoPoziciji As Boolean
    
    
    Private Sub BrojDokumentaC_AfterUpdate()
      'Pred:
      'Na odabir postojećeg dokumenta prikaži ListPredmetiU
      Me.PredD = Null
      PredVrstaD = ""
      Me.ListPredmetiU.RowSource = "SELECT DGLID, SifDV, BrojDokumenta, PodPred FROM DGL" & _
                " WHERE SifPred='" & Me.UBrojDokumentaC.Column(4) & "'" & _
                " ORDER BY SifDV, BrojDokumenta "
      If Me.UBrojDokumentaC.Column(4) <> "" Then Me.PredD = Me.UBrojDokumentaC.Column(4): PredVrstaD = ""
      
    End Sub
    Sub KopiStavkePoZaglavljima()
    
      Dim C As Connection
    
      If ooMsgbox("Odabrana je opcija 'Kopiraj stavke po zaglavljima'!" & vbCrLf & "Jeste li sigurni?", vbQuestion + vbYesNo) = vbNo Then Exit Sub
    
      Set C = CurrentProject.Connection
      C.CommandTimeout = 0
    
      If IsNull(DLookup("Tcj", "TL", "DatumTecaja = CONVERT(DATE, GETDATE()) AND SifVal='" & Me.SifVal & "'")) Then
        'tečaj nije upisan; ako je domaći, upiši 1
        Dim t As String
        If SifVal = rSifVal Then
          t = "1"
          CurrentProject.Connection.Execute "INSERT INTO TL(SifVal,DatumTecaja,Tcj) VALUES ('" & SifVal & "'," & sqldate(Date) & "," & Translate(Format(1, "0.000000"), Format(0, "."), ".") & ")"
        Else 'pitaj za tečaj valute
          If SinkStart(Date, False, Date, Me.SifVal) = False Then
            Do While True
              If grKO!ZaNepoznatiTcjUpisi0 = True Then
                t = 0
              Else
                t = ooInputBox("Upišite tečaj " & SifVal & " za " & Format(Date, "dd.mm.yyyy") & ":", "Unos tečaja", 1)
              End If
              If t = "" Then Exit Sub
              If Not IsNumeric(t) Or t < 0 Then
                ooMsgbox "Neispravan tečaj!", vbExclamation
              Else
                Exit Do
              End If
            Loop
            CurrentProject.Connection.Execute "INSERT INTO TL(SifVal,DatumTecaja,Tcj) VALUES ('" & SifVal & "'," & _
                                          sqldate(Date) & "," & Translate(Format(t, "0.000000"), Format(0, "."), ".") & ")"
          End If
        End If
      End If
      
      With New Command
        .ActiveConnection = C
        .CommandText = "spDST_CopyDST_u_DGL"
        .CommandType = adCmdStoredProc
        .CommandTimeout = 0
        .Parameters.Refresh
        .Parameters(1) = Me.IzBrojDokumenta
        .Parameters(2) = Me.USifDV
        .Parameters(3) = IIf(gSifOsobe = "", Null, gSifOsobe)
        On Error GoTo e
        .Execute
      End With
      
    R:
      ooMsgbox "Stavke dokumenta kopirane u zaglavlja s po jednom stavkom!", vbInformation + vbOKOnly
      Exit Sub
    e:
      If C.Errors.Count > 0 Then
        ooMsgbox C.Errors(0)
      End If
    
    End Sub
    
    
    Private Sub ButDozvolePoRobnimGrupama_Click()
      DoCmd.OpenForm "DGLKopiranjeDozvoleArtikliGrupe", acFormDS
    End Sub
    
    Function JeLiDokumentZatvoren() As Boolean
        Dim R As Recordset
        Set R = New Recordset
        R.Open "SELECT COUNT(*) AS BrotvStavaka FROM dbo.fnNarFIFO (1, " & Me.IzBrojDokumenta & ", NULL, NULL, NULL)", CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
        If R!BrOtvStavaka = 0 Then
          R.Close
          Set R = Nothing
          JeLiDokumentZatvoren = True
        End If
        R.Close
        Set R = Nothing
        
        JeLiDokumentZatvoren = False
    End Function
    
    Function JeLiArtiklDozvoljenNaOdredisnomDokumentu() As Boolean
        Dim Rs_AG4 As Recordset
        Set Rs_AG4 = New Recordset
      
        Rs_AG4.Open " SELECT DST.SifArt" & _
                    " FROM DST INNER JOIN DGL ON DST.DGLID = DGL.DGLID" & _
                    " INNER JOIN DV ON DV.SifDV = '" & Me.USifDV & "'" & _
                    " INNER JOIN Artikli ON DST.SifArt = Artikli.SifArt" & _
                    " INNER JOIN ArtikliGrupe4 ON Artikli.SifGrupe4 = ArtikliGrupe4.SifGrupe4" & _
                    " LEFT JOIN PartneriArtikliGrupe4 PAGK4 ON DGL.Sifpartnera = PAGK4.SifPartnera AND Artikligrupe4.SifGrupe4 = PAGK4.SifGrupe4 AND DV.OdobrenKDArtikliGrupe4 = PAGK4.KD" & _
                    " where ArtikliGrupe4.PotrebnoOdobrenje = 1 And (PAGK4.SifPartnera Is Null Or PAGK4.Odobren = 0) And DV.OdobrenKDArtikliGrupe4 Is Not Null And DGL.DGLID = " & Me.IzBrojDokumenta _
                   , CurrentProject.Connection, adOpenKeyset, adLockOptimistic
      
        If Rs_AG4.RecordCount <> 0 Then
          JeLiArtiklDozvoljenNaOdredisnomDokumentu = False
        End If
      
        Rs_AG4.Close
        Set Rs_AG4 = Nothing
        
        JeLiArtiklDozvoljenNaOdredisnomDokumentu = True
    End Function
    
    Private Sub DohvatiPostavkeKopiranja()
        ZamijeniSklUGlavi = DLookup("ZamijeniSklUGlavi", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        KopiSamoSkl = oonz(DLookup("KopiSamoSkl", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        SetOznacenuIzvornom = DLookup("SetOznacenuIzvornom", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        SklUvijek = oonz(DLookup("SklUvijek", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        Skl2Uvijek = oonz(DLookup("Skl2Uvijek", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        BrojDokumentaU = oonz(DLookup("BrojDokumentaU", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        DatumDokumentaU = oonz(DLookup("DatumDokumentaU", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        NeKopirajNapomene = oonz(DLookup("NeKopirajNapomene", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        PovuciDefaulte = oonz(DLookup("PovuciDefaulte", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        ProvjeriOtvorenost = DLookup("ProvjeriOtvorenost", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        StatusIzvDokID = oonz(DLookup("StatusIzvDokID", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        StatusOdrDokID = oonz(DLookup("StatusOdrDokID", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        UvjeteNabProdUOdrDokIzpart = oonz(DLookup("UvjeteNabProdUOdrDokIzpart", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        ZakljucajIzvDok = oonz(DLookup("ZakljucajIzvDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        ZakljucajOdrDok = oonz(DLookup("ZakljucajOdrDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        SerRaspisi = DLookup("SerRaspisi", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        Rezervacije = DLookup("Rezervacije", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        SifValUSifVal2 = oonz(DLookup("SifValUSifVal2", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
        SifVal2USifVal = oonz(DLookup("SifVal2USifVal", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
        NeKopirajDGLpolja = oonz(DLookup("NeKopirajDGLPolja", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        ObaveznoJednaStavkaUDok = oonz(DLookup("ObaveznoJednaStavkaUDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        FiskalizacijaZaKET = oonz(DLookup("FiskalizacijaZaKET", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        ProknjiziOdredisni = oonz(DLookup("ProknjiziOdredisni", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        PovuciDefaultNapomene = oonz(DLookup("PovuciDefaultNapomene", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        ZamijeniPartneraUGlavi = DLookup("ZamijeniPartneraUGlavi", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        Kol3uKol2 = DLookup("Kol3uKol2", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        EditModeKopiranogDok = DLookup("EditModeKopiranogDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
        DefNapZaPartUvjetiNabave = oonz(DLookup("DefNapZaPartUvjetiNabave", "DV", "SifDV='" & USifDV & "'"), "")
        DefNapZaPartUvjetiProdaje = oonz(DLookup("DefNapZaPartUvjetiProdaje", "DV", "SifDV='" & USifDV & "'"), "")
        PovuciDefaulteZa = oonz(DLookup("PovuciDefaulteZa", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
        KopiDatOpcije = oonz(DLookup("KopiDatOpcije", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        KopirajPriloge = oonz(DLookup("KopirajPriloge", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        KopirajDSTSerBr = oonz(DLookup("KopirajDSTSerBr", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        DodajuWMSPoveznicu = oonz(DLookup("DodajuWMSPoveznicu", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        RaspisiPoPoziciji = oonz(DLookup("RaspisiPoPoziciji", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
        '  se @24.9.2021 default je 2 na zahtjev Hrvoja Svetine
        KopiranjeDatumCassa = oonz(DLookup("KopiranjeDatumCassa", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 2)
        ChkRequired = oonz(DLookup("ChkRequired", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
    End Sub
    
    Public Sub ButKopiraj_Click()
      
      Dim DokID As Long, s As String, skl As String, Poz As String, mjtros As String, DokDatDokumenta As Date
      Dim CtrlGlave As Recordset, DokRS As Recordset, S1 As String, CopyNARIDUStavku As Boolean
    
      Dim f As Field
      Dim P1 As String
      Dim S2 As String
      Dim i As Integer
      
      Dim R As Recordset, R1 As Recordset, R2 As Recordset
      Dim NarJOIN As String, NoMinKolJOIN As String, NoMinKol As Boolean, wS As String
    
          
      Dim StartTime As Double
      Dim SecondsElapsed As Double
      
      Dim DatumZaIzvjestaje As String
      Dim DatPrivZaklj As String
      Dim DatDanas As Date
      
      StartTime = Timer ' Timer -> Returns a Single representing the number of seconds elapsed since midnight.
      mDB_Util.LogB "DGLKopi_Click", "BEGIN"
     
      On Error GoTo Greska
      If ooisnull(Me.IzSifDV) Or ooisnull(Me.USifDV) Then Exit Sub
      
      If DLookup("ZabraniKopiranjeBezSifPred", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = -1 Then
        If Nz(Me.PredD, "") = "" Then
          ooMsgbox "Za odredišni dokument nije odabran predmet/projekt/ugovor!" & vbCrLf & _
                    "Generirajte predmet/projekt/ugovor ili odaberite postojeći!", vbCritical, "OperaOpus"
          Exit Sub
        End If
      End If
      
      CopyNARIDUStavku = False
      
      'hz 7.12.2016.
      If Me.ChkKopiranjeStavakaPoZaglavljima.Value = True Then
        'pozovi posebnu proceduru za kopiranje stavaka izvornog dokumenta po zaglavljima odredišnog, svaki s po jednom stavkom
        Call KopiStavkePoZaglavljima
        Exit Sub
      End If
      
      
      Dim IzDatumDokumenta As Date
      IzDatumDokumenta = DLookup("DatumDokumenta", "DGL", "DGLID = " & Me.IzBrojDokumenta)
      
      ZabraniKopiranjeZatvDok = DLookup("ZabraniKopiranjeZatvDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      If ZabraniKopiranjeZatvDok = True Then
           If JeLiDokumentZatvoren() = True Then
                ooMsgbox "Dokument nema otvorenih stavaka i ne moďż˝e se kopirati (definirano u dozvolama kopiranja)!", vbExclamation + vbOKOnly
                Exit Sub
           End If
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "After ZabraniKopiranjeZatvDok"
      
      'ako se za izvorni dokument obračunava PDV-a po zaglavlju, izračunaj korekciju PDV-a prije kopiranja
      RacunajPDVPoZagl (Me.IzBrojDokumenta)
      
      'provjera odobrenosti dokumenta prije kopiranja (za one vrste dokumenata koji imaju definiran proces odobravanja kojim se zabranjuje kopiranje neodobrenih), ab 20140922
      Set R2 = New Recordset
      R2.Open "EXECUTE [spOdobr_NadjiProcesOdobr] " & Me.IzBrojDokumenta & ", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL", CurrentProject.Connection, adOpenStatic
      If R2.RecordCount <> 0 Then
        If R2!NeodobrenZabraniKopiranje = True Then
          If Nz(DLookup("dbo.fnOdobr_ProvjeraOdobr(" & Me.IzBrojDokumenta & ", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)", "Korisnik"), "0") <> "2" Then
            If oonz(DLookup("OmoguciKopiranjeNeodobrDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False) = False Then
              ooMsgbox "Provjera odobrenosti dokumenta." & vbCrLf & _
                        "Kopiranje dokumenta nije moguće jer dokument nije odobren!" & _
                        vbCrLf & vbCrLf, vbExclamation + vbOKOnly
              Exit Sub
            End If
          End If
        End If
      End If
      R2.Close
      Set R2 = Nothing
      
      mDB_Util.LogB "DGLKopi_Click", "After provjera odobrenosti"
      
      NoMinKol = IIf(Me.CheckStorno, False, NeDozvoliMinuseNaSklad)
      
      NeProvDevDokVal = oonz(DLookup("NeProvjeraDevDokVal", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
    
      If Not Provjeri Then Exit Sub 'provjera upisanih podataka
      
      'odobravanje dobavljača/kupaca prema ArtikliGrupe4'
      
      If JeLiArtiklDozvoljenNaOdredisnomDokumentu() = False Then
        ooMsgbox "Artikl nije dozvoljen na odredišnom dokumentu (" & Me.USifDV & ") - odobrite dobavljača/kupca artikla!", vbExclamation + vbOKOnly
        Exit Sub
      End If
      
      If Not IsNull(Me.SifPartnera) Then
        Dim NazivPartnera As String
        NazivPartnera = Nz(DLookup("NazPartnera", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), "")
        
        Call Provjeri_blokadu
        
        If DLookup("Suspend", "Partneri", "SifPartnera = '" & Me.SifPartnera & "'") Then
          
          If Nz(DLookup("SuspendiranCvrsto", "DV", "SifDV='" & Me.USifDV & "'"), False) = True Then
            'čvrsto suspendiraj
            ooMsgbox "Partner '" & NazivPartnera & "' je suspendiran!" & vbCrLf & "Nije moguće kopirati dokument za tog partnera!", vbExclamation + vbOKOnly
            Cancel = True
            Exit Sub
          Else
            If ooMsgbox("PAŽNJA: Partner '" & NazivPartnera & "' je suspendiran!" & vbCrLf & "Nastaviti?", vbExclamation + vbYesNo) = vbNo Then Exit Sub
          End If
        End If
        
        
        If DLookup("ZabranjenaIsporuka", "Partneri", "SifPartnera = '" & Me.SifPartnera & "'") Then
          If Nz(DLookup("ZabrIspCvrsto", "SecOperGrupe", "SifGrupe='" & gsifgrupe & "'"), False) = True And Nz(DLookup("ZabrIspCvrsto", "DV", "SifDV='" & Me.USifDV & "'"), False) = True Then
            'čvrsto zabrani
            ooMsgbox "Partneru '" & NazivPartnera & "' su zabranjene isporuke!" & vbCrLf & "Nije moguće kopirati dokument za tog partnera!", vbExclamation + vbOKOnly
            Cancel = True
            Exit Sub
          Else
            If ooMsgbox("PAŽNJA: Partneru '" & NazivPartnera & "' su zabranjene isporuke!" & vbCrLf & "Nastaviti!", vbExclamation + vbYesNo) = vbNo Then Exit Sub
          End If
        End If
        
        
        'bj@2.9.19. - provjera za prekoračenje dospijeća
        'bj@19.9.19. - provjeravati će se ukoliko je u postavkama kopiranja tako postavljeno
        '              i ako je dokument označen UI <> 3
        ProvjeravajPrekoracenjeDosp = oonz(DLookup("ProvjeravajPrekoracenjeDosp", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
        Dim UIUSifDV As Integer
        UIUSifDV = oonz(DLookup("UI", "DV", "SifDV = '" & Me.USifDV & "'"), 0)
        
        If ProvjeravajPrekoracenjeDosp = True And UIUSifDV <> 3 Then
            If DLookup("ImaGKS", "DV", "SifDV = '" & Me.USifDV & "'") <> "W" Then
                If oonz(DLookup("PrekoracioDatDosp", "Partneri", "SifPartnera = '" & Me.SifPartnera & "'"), False) = True Then
                    If Nz(DLookup("PrekoracioDatDospKaoUpozorenje", "DV", "SifDV='" & Me.USifDV & "'"), False) = False Then
                        ooMsgbox "Partner '" & NazivPartnera & "' je prekoračio datume dospijeća, isporuke nisu dozvoljene!" & vbCrLf & "Zapis nije moguće spremiti!", vbExclamation + vbOKOnly
                        Cancel = True
                        Exit Sub
                    Else
                        ooMsgbox "Partner '" & NazivPartnera & "' je prekoračio datume dospijeća!", vbExclamation + vbOKOnly
                    End If
                End If
            End If
        End If
        
      End If
        
      If Me.FrameUDok.Value = UDOK_REV Then
        'vrste dokumenata za koje je moguće imati revizije, MORAJU imati u formatu broja dokumenta i oznaku godine!!! npr. imam dok br 1, s 0, 1, 2 revizijama u 2014, i rev 3 u 2015 (kad ne bi bilo oznake godine, onda se taj broj u novoj godini ne bi mogao iskoristiti za dokumente iz 2015)
        If ooisnull(DLookup("FormatBrojaDokumenta", "DV", "SifDV='" & Me.USifDV & "' AND FormatBrojaDokumenta LIKE '%G%'")) Then
          ooMsgbox "GREŠKA: Da bi se koristile revizije dokumenata, format vrste dokumenta MORA sadržavati i oznaku godine!", vbExclamation
          Exit Sub
        End If
      End If
        
      If Not Me.SifVal.enabled Then Me.SifVal = rSifVal
    
      Call ProvjeriTecaj
    
      Dim rSkl As Recordset
      Set rSkl = New Recordset
      
      rSkl.Open "SELECT DISTINCT SifSklad FROM DST WHERE DST.DGLID=" & Me.IzBrojDokumenta & " AND DST.SifSklad NOT IN (" & _
                " SELECT SifSklad FROM DVSkladista WHERE SifDV='" & Me.USifDV & "')", CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
      
      If rSkl.RecordCount > 0 Then
        Dim skl1 As String
        While Not rSkl.EOF
          skl1 = skl1 & IIf(skl1 = "", rSkl!SifSklad, vbCrLf & rSkl!SifSklad)
          rSkl.MoveNext
        Wend
        
        If ooMsgbox("Na odredišnom dokumentu nisu omogućena skladišta koja se nalaze na izvornom dokumentu: " & vbCrLf & skl1 & vbCrLf & "Kopirat će se samo stavke koje se nalaze na dozvoljenim skladištima." & vbCrLf & "Želite li nastaviti kopiranje?", vbYesNo) <> vbYes Then
          rSkl.Close
          Set rSkl = Nothing
          Exit Sub
        End If
        
      End If
      
      rSkl.Close
      Set rSkl = Nothing
      
      MWait
      
      '######## polja glave
      
      If af.Name = "DGL" Then
        StariStatus = oonz(DLookup("IdStatus", "DGL", "DGLID=" & af.DGLID), "")
      End If
      
    'todo - zamijeniti sve ove lookupe jednim odlaskom u bazu!!! hz
      Call DohvatiPostavkeKopiranja
      
      Dim bOriginalniDatum As Boolean
      bOriginalniDatum = oonz(DLookup("OrigDatum", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
      
      Dim dZakljucajPDVDo As Date
      dZakljucajPDVDo = oonz(DLookup("ZakljucajPDVDo", "Korisnik2"), DateSerial(2000, 1, 1))
      
      Dim AutoTeh As Boolean
      AutoTeh = DLookup("AutoTeh", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      'poveznice
      KopirajPoveznicu = DLookup("KopirajPoveznicu", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      NazoviPoveznicuPremaOdredisnom = DLookup("NazoviPoveznicuPremaOdredisnom", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      '23.12.2012
      NeKopirajOznacen = oonz(DLookup("NeKopirajOznacen", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
      If NeKopirajOznacen = True Then
        If DLookup("Oznacen", "DGL", "DGLID=" & Me.IzBrojDokumenta) = True Then
          MNorm
          ooMsgbox "Izvorni dokument je već kopiran i nije dozvoljeno novo kopiranje!", vbExclamation + vbOKOnly
          Exit Sub
        End If
      End If
      
      If ObaveznoJednaStavkaUDok = True Then
        If DCount("*", "DST", "DGLID = " & Me.IzBrojDokumenta) = 0 Then
            MNorm
            ooMsgbox "Izvorni dokument mora imati barem jednu stavku!", vbExclamation + vbOKOnly
            Exit Sub
        End If
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "After lookup block"
      
      BezPorukeZaOtvaranjeDok = DLookup("BezPorukeZaOtvaranjeDok ", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      IzvrsiSQL = oonz(DLookup("IzvrsiSQL", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      
      
      If Me.SifSklad2 <> "" Then
        SifSklad2Edit = Me.SifSklad2
      ElseIf Skl2Uvijek <> "" Then
        SifSklad2Edit = Skl2Uvijek
      Else
        SifSklad2Edit = ""
      End If
      
      Dim oDV As New cDV
      oDV.Init (USifDV)
      'Podrazumijevana knjiga PDV
      If oDV.ImaPDV And bOriginalniDatum Then
        ' prvjeri da
        ' ako je dokument u PDV-u
        ' ako je uključena opcija Originalni datum
        ' ako je datum izvornog dokumenta u zaključanom PDV
        ' ::  zabranjeno je kopiranje
        
        If dZakljucajPDVDo > Me.DatumDokumenta And Not (FiskalizacijaZaKET = True) Then
          MNorm
          ooMsgbox "Datum dokumenta ulazi u zatvoreno PDV razdoblje pa nije moguće kopirati dokument!", vbInformation
          Exit Sub
        End If
        
      End If
      
      
      '-----------------
      
      
      Set DokRS = New Recordset
      DokRS.Open "SELECT * FROM DGL WHERE DGLID=" & Me.IzBrojDokumenta, CurrentProject.Connection
      For Each f In DokRS.Fields
        S1 = S1 & "'" & f.Name & "',"
      Next f
      
      'NeKopirajNapomene
      Dim sNap As String
      
      If NeKopirajNapomene <> "" Then
        For i = 1 To 10
          If InStr(1, NeKopirajNapomene, i) <> 0 Then
            sNap = sNap & "'Napomena" & i & "',"
          End If
        Next i
        If sNap <> "" Then sNap = Left(sNap, Len(sNap) - 1)
      End If
      
      Dim sNeKopirajDGLPolja As String
      sNeKopirajDGLPolja = ""
      If NeKopirajDGLpolja <> "" Then
        Dim sPoljeNeKopiraj As Variant
        For Each sPoljeNeKopiraj In Split(NeKopirajDGLpolja, ",")
          sNeKopirajDGLPolja = sNeKopirajDGLPolja + "'" & Trim(sPoljeNeKopiraj) + "',"
        Next sPoljeNeKopiraj
      End If
      
      s = " SELECT  DVPoljaDGL.CtrlName " & _
          " FROM DVPoljaDGL INNER JOIN DVIzglediDGL ON DVPoljaDGL.SifIzgledaDGL = DVIzglediDGL.SifIzgledaDGL " & _
          " WHERE DVIzglediDGL.SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
          "' AND DVPoljaDGL.SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
          "' AND DVPoljaDGL.CtrlName NOT IN (" & sNeKopirajDGLPolja & _
          "'SifDV','BrojDokumenta','DatumDokumenta','ModelPozivaNaBroj','PozivNaBroj','Godina','IntBrojDokumenta', 'Rev', 'SIfPodruznice', " & _
          "'Tecaj','SifPartnera','TipRacuna','SifPDVKnjige','SifVrOp'," & _
          "'FiskVrijemeIzdavanja', 'FiskJIR', 'FiskZKI', 'FiskIDNaplUr', " & _
          "'PDVDatum','SifMjTr','NarDGLID', 'NarOK', 'PovDGLID', 'NeASkl', 'DatumPlacanja'" & IIf(gSifOsobe <> "", ",'IzradilaSifOsobe'", "") & ")" & _
          " AND DVPoljaDGL.CtrlName IN (" & Left(S1, Len(S1) - 1) & ")" & _
          IIf(sNap <> "", " AND DVPoljaDGL.CtrlName NOT IN (" & sNap & ")", "")
      
      'WSDGLID kopiraj bez obzira da li je prikazan na formi ili ne
      s = s & " UNION SELECT 'WSDGLID'"
      
      If grKO!ImaCRM = True Then
        s = s & " UNION SELECT 'CPID' UNION SELECT 'CPDAID' UNION  SELECT 'COID' UNION SELECT 'CKamID'" & _
                " UNION SELECT 'CProdID' UNION SELECT 'CNabID' UNION SELECT 'CZadID' UNION SELECT 'CDogID' " & _
                " UNION SELECT 'CRjesID' UNION SELECT 'CUpitID' "
      End If
      Set CtrlGlave = New Recordset
      CtrlGlave.Open s, CurrentProject.Connection
      
      s = ""
      
      If FiskalizacijaZaKET = True Then
        Dim sd As String, DT As Double, sSifVal As String
        Dim Rprov As Recordset
        sd = oonz(DLookup("DatumDokumenta", "DGL", "DGLID = " & Me.IzBrojDokumenta), CStr(Date))
        sSifVal = oonz(DLookup("SifVal", "DGL", "DGLID = " & Me.IzBrojDokumenta), rSifVal())
        
        'bj@13.1.2020. - dodan uvjet => AND Godina = " & Year(Nz(Me.DatumDokumenta, Year(Date)))
        If DCount("*", "DGL", "BrojDokumenta = '" & Me.UBrojDokumenta & "' AND SifDV = '" & Me.USifDV & "' AND Godina = " & Year(Nz(Me.DatumDokumenta, Year(Date)))) > 0 Then
            ooMsgbox "Dokument je već fiskaliziran! (broj postoji)"
            MNorm
            Exit Sub
        End If
      
        'postavi datum dokumenta i PDV datum prema definiranoj logici: ako je DatumOpcije manji od MAX(ZakljucajPDVDo, MAX(DatumObrRaz), DatumPrivremenogZakljucavanja) onda se uzima prvi dan nakon tog MAX datuma, a ako je DatumOpcije veći od tog MAX datuma onda se uzima DatumOpcije
        Set Rprov = New Recordset
        Rprov.Open "SELECT 1 AS Ima FROM (SELECT MAX(Datum) AS ZadnjiDatum FROM (SELECT ZakljucajPDVDo AS Datum FROM Korisnik2 UNION ALL SELECT MAX(DatumObrRaz) AS Datum FROM ObracunskaRazdoblja UNION ALL SELECT DATEADD(d,-1,CAST(CAST(YEAR(DatumPrivremenogZakljucavanja) AS varchar) + '-' + CAST(MONTH(DatumPrivremenogZakljucavanja) AS varchar) + '-' + '01' AS SMALLDATETIME)) AS Datum FROM Korisnik2 WHERE DatumPrivremenogZakljucavanja IS NOT NULL) t ) z" & _
                   " WHERE z.ZadnjiDatum >= (SELECT DatumDokumenta FROM DGL WHERE DGLID = " & Me.IzBrojDokumenta & ") ", CurrentProject.Connection, adOpenKeyset, adLockOptimistic
        If Rprov.RecordCount > 0 Then sd = GetFirstOpenDate()
        Rprov.Close
        
        'tecaj:
        If DCount("*", "TL", "SifVal='" & sSifVal & "' AND DatumTecaja=" & sqldate(CVDate(sd))) = 0 Then
          If sSifVal = rSifVal() Then
            CurrentProject.Connection.Execute "INSERT TL (SifVal, DatumTecaja, Tcj)" & _
                        " VALUES ('" & rSifVal & "', " & sqldate(CVDate(sd)) & ", 1)"
          Else
            On Error Resume Next
            If CVDate(sd) >= CVDate("01.01." & Format(Date, "yyyy")) And CVDate(sd) <= Date Then   'Or DateDiff("sd", Date, Me.DatumDokumenta) = "1"
               If SinkStart(CVDate(sd), False, CVDate(sd), SifVal) = False Then GoTo SinkFailed
            Else
    SinkFailed:
              If grKO!ZaNepoznatiTcjUpisi0 = True Then
                DT = 0
              Else
                DT = CDbl(ooInputBox("Upišite srednji tečaj za valutu '" & sSifVal & "' na dan " & CVDate(sd), "Tečaj"))
              End If
              On Error GoTo 0
              If DT < 0 Then
                ooMsgbox "Neispravan tečaj."
                Exit Sub
              Else
              CurrentProject.Connection.Execute "INSERT TL (SifVal, DatumTecaja, Tcj)" & _
                            " VALUES ('" & SifVal & "', " & sqldate(CVDate(sd)) & ", " & _
                            Translate(Format(DT, "General Number"), Format(0, "."), ".") & ")"
              End If
            End If
          End If
        End If
      End If
      
      On Error GoTo Greska
      
        If oonz(DLookup("PuniDatumZaIzvjestaje", "Korisnik2", ""), False) = True Then
            'bj@2.9.2020. - Datum za izvještaje se dohvaća preko funkcije na bazi
            DatumZaIzvjestaje = DLookup("dbo.fnGetDatumZaIzvjestaje(0, " & sqldate(IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta)) & ")", "Korisnik", "")
        
    '        DatDanas = Date
    '        DatPrivZaklj = oonz(DLookup("DatumPrivremenogZakljucavanja", "Korisnik2", ""), "")
    '
    '        If oonz(DatPrivZaklj, "") <> "" Then
    '            If DatDanas >= CDate(DatPrivZaklj) And IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta) < DateSerial(Year(DatDanas), Month(DatDanas), 1) Then
    '                DatumZaIzvjestaje = CStr(DatDanas)
    '            Else
    '                DatumZaIzvjestaje = CStr(IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta))
    '            End If
    '        End If
        End If
      
      'premjestio kasnije unutar eventa jer iznad ima modifikacija datuma
      If DatumZaIzvjestaje = "" Then
        ProvjeraDatumZakZat = oonz(DLookup("dbo.fnProvjeraDatumaZakZat(" & sqldate(IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta)) & ", '" & gsifgrupe & "', '')", "Korisnik"), "")
      Else
        ProvjeraDatumZakZat = oonz(DLookup("dbo.fnProvjeraDatumaZakZat(" & sqldate(oonz(DatumZaIzvjestaje, IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta))) & ", '" & gsifgrupe & "', '')", "Korisnik"), "")
      End If
      If ProvjeraDatumZakZat <> "" Then
        ooMsgbox ProvjeraDatumZakZat, vbExclamation + vbOKOnly
        Exit Sub
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "Before upis glave"
      
      
      'bj@15.02.2019.
      'Provjera za generiranje poziva na broj novog dokumenta kod kopiranja u novi dokument
      Dim ModelPozivaNaBroj As String
      Dim PozivNaBroj As String
      Dim IzvucenPozivNaBroj As Boolean
      ModelPozivaNaBroj = ""
      PozivNaBroj = ""
      IzvucenPozivNaBroj = False
      
      If Me.FrameUDok = UDOK_NOVI Then
        Dim FormatPozivaNaBroj As String
        FormatPozivaNaBroj = oonz(DLookup("FormatPozivaNaBroj", "DV", "SifDV = '" & Me.USifDV & "'"), "")
        
        'kreni u generiranje ako postoji format generiranja i ako je izvučeno polje poziva na broj na formu
        If FormatPozivaNaBroj <> "" Then
        
            'Provjeri da li je vidljiva kontrola PozivNaBroj na odredišnom dokumentu
            Dim rND1 As Recordset
            Set rND1 = New Recordset
            rND1.Open "SELECT  DVPoljaDGL.CtrlName " & _
              " FROM DVPoljaDGL INNER JOIN DVIzglediDGL ON DVPoljaDGL.SifIzgledaDGL = DVIzglediDGL.SifIzgledaDGL " & _
              " WHERE DVIzglediDGL.SifIzgledaDGL = '" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
              "' AND DVPoljaDGL.SifIzgledaDGL = '" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
              "' AND DVPoljaDGL.CtrlName = 'PozivNaBroj'", CurrentProject.Connection, adOpenStatic
            
            If rND1.RecordCount > 0 Then
                IzvucenPozivNaBroj = True
            End If
            rND1.Close
            Set rND1 = Nothing
            
            'Nastavi generiranje PNBO ako je vidljivo to polje na odredišnom dokumentu
            If IzvucenPozivNaBroj = True Then
                Dim RPNBO As Recordset
                Set RPNBO = New Recordset
                
                RPNBO.Open "EXEC [dbo].[spGenerirajPozivNaBroj] '" & Me.USifDV & "', '" & oonz(Me.UBrojDokumenta, "") & "', " & sqldate(IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta)) & ", '" & oonz(Me.SifPartnera, "") & "', '" & oonz(Me.SifMjTr, "") & "'", _
                        CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
                        
                'ukoliko postoji poruka od store, prikaži ju i prekini spremanje jer se poziv na broj nije generirao
                If oonz(RPNBO!Poruka, "") <> "" Then
                    MNorm
                    ooMsgbox RPNBO!Poruka, vbExclamation + vbOKOnly
                    RPNBO.Close
                    Set RPNBO = Nothing
                    Cancel = True
                    Exit Sub
                End If
                
                'postavi model i poziv na broj
                ModelPozivaNaBroj = oonz(RPNBO!ModelPozivaNaBroj, "")
                PozivNaBroj = oonz(RPNBO!PozivNaBroj, "")
                
                RPNBO.Close
                Set RPNBO = Nothing
            End If
          
        End If
        
      End If
      
      
      'On Error GoTo Greska
      'BeginTrans
      'upis glave novog dokumenta
      If Me.FrameUDok = UDOK_NOVI Or Me.FrameUDok = UDOK_REV Then
        Set R = New Recordset
        R.Open "SELECT * FROM DGL WHERE DGLID=0", CurrentProject.Connection, adOpenKeyset, adLockOptimistic
        With R
          .AddNew
          
          !SifDV = Me.USifDV
          !BrojDokumenta = IIf(Me.FrameUDok = UDOK_NOVI, Me.UBrojDokumenta, Me.IzBrojDokumenta.Column(IZBD_BrojDokumenta)) 'ako se kopira u novu reviziju, BrojDokumenta ostaje isti, samo je Rev drugačiji
          If Me.FrameUDok = UDOK_NOVI Then
            !Rev = 0
           Else 'Rev
            !Rev = Me.URevBr
          End If
          !DatumDokumenta = IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta)
    '      !DatumPlacanja = IIf(Me.DatumPlacanja = "", Null, Me.DatumPlacanja)
    
          DokDatDokumenta = !DatumDokumenta
    
            '-----------------------------------------------------------------------------------------
            'bj@11.08.2020. - postavljanje Datuma za izvještaje ne ide više preko UPDATE-a nakon
            '   INSERT-a, nego se mora odmah upisati zbog novih izmjena u trigger-u. BŠ i Colas.
            '   Dodana postavka u Korisnik2. DatumZaIzvjestaje se izračuna ranije gore zbog provjere
            '   preko funkcije fnProvjeraDatumaZakZat
            '-----------------------------------------------------------------------------------------
            If oonz(DLookup("PuniDatumZaIzvjestaje", "Korisnik2", ""), False) = True And DatumZaIzvjestaje <> "" Then
                !DatumZaIzvjestaje = CDate(DatumZaIzvjestaje)
            End If
            '-----------------------------------------------------------------------------------------
          
          'bj@22.11.2018. - postavi datum plaćanja ako polje DatumPlacanja nije navedeno u postavkama kopiranja preko varijable NeKopirajDGLPolja (DP-Agmar)
          If InStr(NeKopirajDGLpolja, "DatumPlacanja") = 0 Then
            !DatumPlacanja = IIf(ZamijeniPartneraUGlavi, DateSerial(Year(Me.DatumDokumenta), Month(Me.DatumDokumenta), Day(Me.DatumDokumenta) + Int(Nz(DLookup("DanPlacanja", "Partneri", "SifPartnera = '" & Me.IzBrojDokumenta.Column(IZBD_SifPartnera2) & "'"), 0))), IIf(Me.DatumPlacanja = "", Null, Me.DatumPlacanja))
          End If
          
          'bj@15.02.2019. - postavljanje modela i poziva na broj
          If PozivNaBroj <> "" Then
            !ModelPozivaNaBroj = ModelPozivaNaBroj
            !PozivNaBroj = PozivNaBroj
          End If
          
    If Me.FrameUDok = UDOK_REV Then
    
    Dim ModelPozivaNaBrojZaReziviju
    Dim PozivNaBrojZaReviziju
    
    ModelPozivaNaBrojZaReziviju = DLookup("ModelPozivaNaBroj", "DGL", "DGLID = " & Me.IzBrojDokumenta)
    PozivNaBrojZaReviziju = DLookup("PozivNaBroj", "DGL", "DGLID = " & Me.IzBrojDokumenta)
        
    !ModelPozivaNaBroj = ModelPozivaNaBrojZaReziviju
    !PozivNaBroj = PozivNaBrojZaReviziju
    
    End If
          
          'bj@23.01.2019. - kopiranje datuma opcije
          If KopiDatOpcije > 0 Then
            Dim DatumOpcijeIZ As String
            Dim DatumDokumentaIZ As Date
            Dim BrojDanaIZ As Integer
            
            DatumOpcijeIZ = oonz(DLookup("DatumOpcije", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
            DatumDokumentaIZ = DLookup("DatumDokumenta", "DGL", "DGLID = " & Me.IzBrojDokumenta)
            
            ' Kopiraj datum opcije ukoliko postoji na početnom dokumentu
            If DatumOpcijeIZ <> "" Then
            
                'Izračuna broj dana za cassu
                BrojDanaIZ = dateDiff("d", DatumDokumentaIZ, CDate(DatumOpcijeIZ))
                
                'u slučaju da je KopiDatOpcije:
                '   1 - kopira se originalni datum opcije sa izvornog dokumenta
                '   2 - datum opcije se računa sa odmakom broja dana između datuma dokumenta i datuma opcije na izvornom dokumentu u odnosu na novi datum dokumenta
                
                If KopiDatOpcije = 1 Then
                    !DatumOpcije = DatumOpcijeIZ
                ElseIf KopiDatOpcije = 2 Then
                    !DatumOpcije = DateSerial(Year(!DatumDokumenta), Month(!DatumDokumenta), Day(!DatumDokumenta) + Int(BrojDanaIZ))
                End If
            End If
          End If
          
    
    
          
          !Godina = Year(Me.DatumDokumenta)
          If Me.FrameUDok = UDOK_REV Then
            'kopiranje u novu reviziju
            If Year(Me.DatumDokumenta) = Year(Me.IzBrojDokumenta.Column(IZBD_DatumDokumenta)) Then
              'ako je kopiranje u istoj godini, u IntBrojDokumenta upiši isti broj kao što je u izvornom dokumentu
              !IntBrojDokumenta = BrojDokumentaToInt(Me.IzBrojDokumenta.Column(IZBD_BrojDokumenta), Me.USifDV.Column(USDV_FormatBrojaDokumenta), Me.USifDV.Column(0), Me.SifMjTr, , oonz(Me.SifPodruznice, ""))
              'napomena - ne bi se smjelo moći kopirati u novu reviziju u drugo mjesto troška, ako je numeracija po mjestu troška
            Else
              'ako je prijelaz godine, u IntBrojDokumenta upiši 0 da ne remeti brojač u novoj godini
              !IntBrojDokumenta = 0
            End If
          Else
            'kopiranje u novi dokument
            !IntBrojDokumenta = BrojDokumentaToInt(Me.UBrojDokumenta, Me.USifDV.Column(USDV_FormatBrojaDokumenta), Me.USifDV.Column(0), Me.SifMjTr, , oonz(Me.SifPodruznice, ""))
          End If
          !SifVal = Me.SifVal
        
          If FiskalizacijaZaKET = True Then !PDVDatum = sd
    
          If Me.SifPartnera.enabled Then
          
            !SifPartnera = IIf(Me.SifPartnera = "", Null, Me.SifPartnera)
            
            If ZamijeniPartneraUGlavi Then
              !SifPartnera = DokRS.Fields("SifPartnera2")
            End If
            
          End If
          If Me.TipRacuna.enabled Then
            !TipRacuna = IIf(Me.TipRacuna = "", Null, Me.TipRacuna)
            !SifPDVKnjige = IIf(Me.SifPDVKnjige = "", Null, Me.SifPDVKnjige)
            !SifVrOp = IIf(Me.SifPDVKnjige = "", Null, Me.SifVrOp)
            
            If oonz(!TipRacuna, "") = "R2" Or oonz(!TipRacuna, "") = "UV" Or oonz(!TipRacuna, "") = "NAP" Or oDV.PopuniPdvDatum = False Then
                !PDVDatum = Null
            Else
                !PDVDatum = IIf(FiskalizacijaZaKET = True, sd, Me.DatumDokumenta)
            End If
            
            If oonz(DLookup("ZakljucajPDVDo", "Korisnik2"), "") <> "" Then
              If Me.DatumDokumenta <= oonz(DLookup("ZakljucajPDVDo", "Korisnik2"), "") Then
                ooMsgbox "Nije dozvoljeno kopirati dokument u zatvoreno PDV razdoblje " & vbCrLf & "(datum dokumenta/PDV datum mora biti veći od " & oonz(DLookup("ZakljucajPDVDo", "Korisnik2"), "") & ")!"
                MNorm
                .CancelUpdate
                Exit Sub
              End If
            End If
            
          End If
          !SifMjTr = IIf(Me.SifMjTr = "", Null, Me.SifMjTr)
          If Not IsNull(DLookup("CtrlName", "DVPoljaDGL", "SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & "' AND CtrlName='SifPodruznice'")) Then
            !SifPodruznice = IIf(Me.SifPodruznice = "", Null, Me.SifPodruznice)
          End If
          !PodPred = IIf(Me.PodPred = "", Null, Me.PodPred)
          If Me.CheckPov = True Then !PovDGLID = Me.IzBrojDokumenta.Column(IZBD_DGLID) 'povratnica
          If Me.USifDV.Column(USDV_DefNeASkl) = True Then !NeASkl = True        'DefNeASkl
                
          If gSifOsobe <> "" Then !IzradilaSifOsobe = gSifOsobe
                
          Dim pom As String
          'upis ostalih kontrola glave
          Do Until CtrlGlave.EOF
            pom = CtrlGlave.Fields!CtrlName 'iz nekog razloga treba u pom varijablu
            Select Case .Fields(pom).Name
              'Case "DatumPlacanja"
                'ako u odredišnom postoji DatumPlacanja, povuci iz partnera (ako postoji partner u izvornom)
              '  If Me.SifPartnera.Enabled And IsNull(DLookup("DatumPlacanja", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID))) Then
              '        .Fields(pom) = DateAdd("d", Nz(DLookup("DanPlacanja", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), 0), Date)
              '  Else
              '    .Fields(pom) = DokRS.Fields(pom)
              '  End If
              
              Case "SifPlacanja"
                'ako postoji default SifPlacanja, povuci ga
                Dim sifplac As String
                sifplac = Nz(DLookup("DefSifPlacanja", "DV", "SifDV='" & Me.USifDV & "'"), "")
                If sifplac <> "" And IsNull(DLookup("SifPlacanja", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID))) Then
                  .Fields(pom) = sifplac
                Else
                  .Fields(pom) = DokRS.Fields(pom)
                End If
                
              'Case .Fields(pom).Name = "SifSklad" And Me.FrameSkladišta.Value = SKL_KOR
              '  .Fields(pom) = Me.SifSklad
              Case "DatumCassaSconta"
                  'se@24.09.2021. - postavljanje datuma Casse
                  Const NE_KOPIRAJ As Integer = 0
                  Const KOPIRAJ_S_ORIGINALNOG_DOKUMENTA As Integer = 1
                  Const KOPIRAJ_S_ODMAKOM As Integer = 2
                    
                  Dim DatumCassaScontaIZ As String
                  If KopiranjeDatumCassa = NE_KOPIRAJ Then
                        .Fields(pom) = Null
                  ElseIf KopiranjeDatumCassa = KOPIRAJ_S_ORIGINALNOG_DOKUMENTA Then
                        DatumCassaScontaIZ = oonz(DLookup("DatumCassaSconta", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
            
                        If (DatumCassaScontaIZ <> "") Then
                            .Fields(pom) = DatumCassaScontaIZ
                        End If
                  ElseIf KopiranjeDatumCassa = KOPIRAJ_S_ODMAKOM Then
                        Dim DatumOpcijeIZCassa As String
                        Dim DatumDokumentaIZCassa As String
                        Dim difference As Integer
            
                        DatumCassaScontaIZ = oonz(DLookup("DatumCassaSconta", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
                        DatumOpcijeIZCassa = oonz(DLookup("DatumOpcije", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
                        DatumDokumentaIZCassa = oonz(DLookup("DatumDokumenta", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
            
                        Dim PuniDatumCassaScontaUDatumOpcije As Boolean
                        Dim PovuciDef_Franko_Trans_IzPartDob As Boolean
            
                        PuniDatumCassaScontaUDatumOpcije = oonz(DLookup("PuniDatumCassaScontaUDatumOpcije", "Korisnik2"), False)
                        PovuciDef_Franko_Trans_IzPartDob = oonz(DLookup("PovuciDef_Franko_Trans_IzPartDob ", "DV", "SifDV ='" + Me.USifDV + "'"), False)
            
                        If DatumCassaScontaIZ <> "" Then
                            Dim DatumCassaScontaU As Date
                            If PovuciDef_Franko_Trans_IzPartDob = True And DatumOpcijeIZCassa <> "" Then
                                difference = dateDiff("d", CDate(DatumOpcijeIZCassa), CDate(DatumCassaScontaIZ))
            
                                DatumCassaScontaU = DateAdd("d", difference, Me.DatumDokumenta)
                                .Fields(pom) = DatumCassaScontaU
                            Else
                                difference = dateDiff("d", CDate(DatumDokumentaIZCassa), CDate(DatumCassaScontaIZ))
            
                                DatumCassaScontaU = DateAdd("d", difference, Me.DatumDokumenta)
                                .Fields(pom) = DatumCassaScontaU
                            End If
                        End If
                  End If
              Case "SifSklad"
                If ZamijeniSklUGlavi = True Then
                  .Fields("SifSklad") = DokRS.Fields("SifSklad2")
                ElseIf Me.FrameSkladista.Value = SKL_KOR Then .Fields(pom) = Me.SifSklad
                Else
                  If Not ooisnull(SklUvijek) Then
                    .Fields(pom) = SklUvijek
                  Else
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
                End If
                
              Case "SifSklad2"
                If ZamijeniSklUGlavi = True Then
                  .Fields("SifSklad2") = DokRS.Fields("SifSklad")
                ElseIf Me.FrameSkladista2.Value = SKL_KOR Then .Fields(pom) = Me.SifSklad2
                Else
                  .Fields(pom) = Nz(DokRS.Fields(pom), Skl2Uvijek)
                End If
              
              Case "VodiPredmetSifOsobe"
                'napravljeno 21.11.2005, za DELTU i HORVATA jer oni često mijenjaju DefKomerc uz Partnera, a imaju starih ponuda, pa da im se u DGL.VodiPredmetSifOsobe iskopira novi komercijalist
                Dim VPSifOsobe As String, DodAdresaID As Long
               
                If Me.SifPartnera.enabled And Not IsNull(Me.SifPartnera) Then
                  'osoba iz partnera
                  VPSifOsobe = Nz(DLookup("DefVodiPredmetSifOsobe", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), "")
                  'ako nije promijenjen partner, provjeri da li je u izvornom dokumentu odabrana poslovnica, pa uzmi njenu osobu VodiPredmet (bio problem u Apipharmi - 02.02.2008.)
                  If Nz(Me.SifPartnera, "") = Nz(Me.IzBrojDokumenta.Column(IZBD_SifPartnera), "") Then
                    DodAdresaID = Nz(DLookup("DodAdresaID", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID)), 0)
                    'uzmi def osobu iz poslovnice (ako je pridružena), inače ostavi VPSifOsobe iz Partnera
                    VPSifOsobe = Nz(DLookup("DefVodiPredmetSifOsobe", "PartneriDodAdrese", "DodAdresaID=" & DodAdresaID), VPSifOsobe)
                  End If
                  
                  If VPSifOsobe <> "" And IsNull(DokRS.Fields(pom)) Then 'isnull dodan 15.3.2011 - ne treba prepisivati podraz komerc, ako je u izvornom dokumentu komercijalist već upisan
                    .Fields(pom) = VPSifOsobe
                  Else
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
                End If
              
              Case "DodAdresaID"
                If Nz(Me.SifPartnera, "") <> Nz(Me.IzBrojDokumenta.Column(IZBD_SifPartnera), "") Then
                  .Fields(pom) = Null 'ako je promijenjen partner prilikom kopiranja, obriši poslovnicu (dogodilo se u Rascu, UPNARd, Golić, 27.04.2007)
                Else
                  If ZamijeniPartneraUGlavi = True Then
                    .Fields(pom) = DokRS.Fields("DodAdresaID2")
                  Else
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
                End If
              
              Case "DodAdresaID2"
                  If ZamijeniPartneraUGlavi = True Then
                    .Fields(pom) = DokRS.Fields("DodAdresaID")
                  Else
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
              
              Case "NaRukeSifOsobe"
                If Nz(Me.SifPartnera, "") <> Nz(Me.IzBrojDokumenta.Column(IZBD_SifPartnera), "") Then
                  .Fields(pom) = Null 'ako je promijenjen partner prilikom kopiranja, obriši osobu NaRuke
                Else
                  If ZamijeniPartneraUGlavi = True Then
                    .Fields(pom) = DokRS.Fields("NaRukeSifOsobe2")
                  Else
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
                End If
              
              Case "NaRukeSifOsobe2"
                  If ZamijeniPartneraUGlavi = True Then
                    .Fields(pom) = DokRS.Fields("NaRukeSifOsobe")
                  Else
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
              
              
              Case "IDStatus"
                If StatusOdrDokID > 0 Then
                  .Fields("IDStatus") = StatusOdrDokID
                  If DLookup("ZakljucajDGL", "DGLStatusi", "ID=" & StatusOdrDokID) = True Then .Fields("Knjizeno") = True
                  CurrentProject.Connection.Execute "dbo.spCRM_AzurirajCUpit " & Me.IzBrojDokumenta & ", " & StatusOdrDokID
                End If
                
              Case "napomena1", "napomena2", "napomena3", "napomena4", "napomena5", "napomena6", "napomena7", "napomena8", "napomena9", "napomena10", "Napomena11", "Napomena12"
                If UvjeteNabProdUOdrDokIzpart = -1 Then
                  If DefNapZaPartUvjetiNabave = Right(pom, 1) And Not ooisnull(Me.SifPartnera) Then .Fields(pom) = DLookup("UvjetiNabave", "Partneri", "SifPartnera='" & Me.SifPartnera & "'")
                  If DefNapZaPartUvjetiProdaje = Right(pom, 1) And Not ooisnull(Me.SifPartnera) Then .Fields(pom) = DLookup("UvjetiProdaje", "Partneri", "SifPartnera='" & Me.SifPartnera & "'")
                  If DefNapZaPartUvjetiProdaje <> Right(pom, 1) And DefNapZaPartUvjetiNabave <> Right(pom, 1) Then
                    .Fields(pom) = DokRS.Fields(pom)
                  End If
                Else
                'If DefNapZaPartUvjetiProdaje <> Right(pom, 1) And DefNapZaPartUvjetiNabave <> Right(pom, 1) Then
                  .Fields(pom) = DokRS.Fields(pom)
                End If
                
              Case "SifSmjene"
                If Nz(gSifSmjene, "") <> "" Then
                  .Fields("SifSmjene") = gSifSmjene
                Else
                  Dim smjeneList As String
                      smjeneList = "Potrebno je odabrati smjenu za kopirani dokument" & vbCrLf & "jer operater ne radi u smjenama!" & vbCrLf & vbCrLf
                      
                  Dim rsSmjene As Recordset
                  Set rsSmjene = New Recordset
                      rsSmjene.Open "SELECT ROW_NUMBER() OVER(ORDER BY SifSmjene) AS Izbor, SifSmjene, NazSmjene FROM Smjene", CurrentProject.Connection, adOpenForwardOnly
                  
                  While Not rsSmjene.EOF
                    smjeneList = smjeneList & rsSmjene.Fields(0) & " (" & rsSmjene.Fields(2) & ")" & vbCrLf
                    rsSmjene.MoveNext
                  Wend
                  
                  smjeneList = Left(smjeneList, Len(smjeneList) - 2)
    
                  Dim iz As Integer
                  iz = oonz(ooInputBox(smjeneList, "", 1), 0)
                  
                  If iz = 0 Then
                    ooMsgbox "Neispravan odabir", vbInformation + vbOKOnly
                    rsSmjene.Close
                    Set rsSmjene = Nothing
                    Exit Sub
                  End If
                  
                  'pronađi izbor u recordset-u
                  Multi_Find rsSmjene, "Izbor = " & iz
                  
                  If rsSmjene.EOF = True Then
                    ooMsgbox "Neispravan odabir", vbInformation + vbOKOnly
                    rsSmjene.Close
                    Set rsSmjene = Nothing
                    Exit Sub
                  End If
                  
                  .Fields("SifSmjene") = rsSmjene("SifSmjene")
                  
                  rsSmjene.Close
                  Set rsSmjene = Nothing
                End If
              
              Case "SifPartnera2"
                Dim sp2 As String
                sp2 = oonz(DLookup("DefSifPartnera2", "DV", "SifDV='" & Me.USifDV & "'"), "")
                If sp2 = "" Or Not IsNull(DokRS.Fields(pom)) Then
                  .Fields(pom) = DokRS.Fields(pom)
                Else
                  .Fields(pom) = sp2
                End If
                
                If ZamijeniPartneraUGlavi Then
                  .Fields(pom) = DokRS.Fields("SifPartnera")
                End If
              
              Case "EksterniBroj"
                If DLookup("PovuciEksterniBroj", "DV", "SifDV='" & Me.USifDV & "'") = -1 And IsNull(DLookup("EksterniBroj", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID))) Then
                  Dim EksterniBr As String
                  EksterniBr = Nz(DLookup("DefEksterniBroj", "PartneriDodAdrese", "DodAdresaID=" & Nz(DLookup("DodAdresaID", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID)), 0)), "")
                  If EksterniBr <> "" Then
                    .Fields(pom) = EksterniBr
                  Else
                    EksterniBr = Nz(DLookup("DefEksterniBroj", "Partneri", "SifPartnera='" & Nz(DLookup("SifPartnera", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID)), "") & "'"), "")
                    If EksterniBr <> "" Then
                      .Fields(pom) = EksterniBr
                    End If
                  End If
                Else
                  .Fields(pom) = DokRS.Fields(pom)
                End If
              
              Case "SifVal2"
                If SifValUSifVal2 Then
                  .Fields("SifVal2") = DokRS.Fields("SifVal")
                ElseIf Not IsNull(Me.SifVal2) Then
                  .Fields("SifVal2") = Me.SifVal2
                Else
                   Dim vSifVal2 As String
                   vSifVal2 = oonz(DLookup("DefSifVal2", "DV", "SifDv = '" & Me.USifDV & "'"), "")
                   If Not ooisnull(vSifVal2) Then .Fields(pom) = vSifVal2
                   If Not ooisnull(DokRS.Fields(pom)) Then .Fields(pom) = DokRS.Fields(pom)
                End If
                
              Case "SifVal"
                If SifVal2USifVal And oonz(DokRS.Fields("SifVal2"), "") <> "" Then
                    'tecaj:
                    If DCount("*", "TL", "SifVal='" & DokRS.Fields("SifVal2") & "' AND DatumTecaja=" & sqldate(CVDate(.Fields("DatumDokumenta")))) = 0 Then
                      If DokRS.Fields("SifVal2") = rSifVal() Then
                        CurrentProject.Connection.Execute "INSERT TL (SifVal, DatumTecaja, Tcj)" & _
                                    " VALUES ('" & DokRS.Fields("SifVal2") & "', " & sqldate(CVDate(.Fields("DatumDokumenta"))) & ", 1)"
                      Else
                        On Error Resume Next
                        If CVDate(sd) >= CVDate("01.01." & Format(Date, "yyyy")) And CVDate(.Fields("DatumDokumenta")) <= Date Then   'Or DateDiff("sd", Date, Me.DatumDokumenta) = "1"
                           If SinkStart(CVDate(.Fields("DatumDokumenta")), False, CVDate(.Fields("DatumDokumenta")), DokRS.Fields("SifVal2")) = False Then GoTo SinkFail
                        Else
    SinkFail:
                          If grKO!ZaNepoznatiTcjUpisi0 = True Then
                            DT = 0
                          Else
                            DT = CDbl(ooInputBox("Upišite srednji tečaj za valutu '" & DokRS.Fields("SifVal2") & "' na dan " & CVDate(.Fields("DatumDokumenta")), "Tečaj"))
                          End If
                          On Error GoTo 0
                          If DT < 0 Then
                            ooMsgbox "Neispravan tečaj."
                            Exit Sub
                          Else
                          CurrentProject.Connection.Execute "INSERT TL (SifVal, DatumTecaja, Tcj)" & _
                                        " VALUES ('" & DokRS.Fields("SifVal2") & "', " & sqldate(CVDate(.Fields("DatumDokumenta"))) & ", " & _
                                        Translate(Format(DT, "General Number"), Format(0, "."), ".") & ")"
                          End If
                        End If
                      End If
                    End If
                  
                  .Fields("SifVal") = DokRS.Fields("SifVal2")
                End If
                            
              Case "AlternativniFiskBrojDokumenta"
                Dim NewBr As String
                Dim NewBrFormat As String
                Dim BrojDokZaSufiks As String
                
                'bj@21.1.2022. - sufiks će se kreirati samo za KET=1
                If gbIsKET = True Then
                    If oonz(DLookup("AltFiskBrNacinNumeracije", "DV", "SifDV='" & Me.USifDV & "' and AltFiskBrNacinNumeracije = 'PO'"), "") = "PO" Or _
                       oonz(DLookup("AltFiskBrNacinNumeracije", "DV", "SifDV='" & Me.USifDV & "' and AltFiskBrNacinNumeracije = 'PG'"), "") = "PG" Then
                      BrojDokZaSufiks = ""
                    Else
                      BrojDokZaSufiks = IIf(Me.FrameUDok = UDOK_NOVI, Me.UBrojDokumenta, Me.IzBrojDokumenta.Column(IZBD_BrojDokumenta))
                    End If
                Else
                    BrojDokZaSufiks = ""
                End If
                
                NewBrFormat = oonz(DLookup("AltFiskBrFormatBrojaDokumenta", "DV", "SifDv = '" & Me.USifDV & "'"), "")
                
                If ooisnull(NewBrFormat) Then
                    ooMsgbox "Upišite format za alt. fisk. br. u odredišnoj vrsti dokumenta!", vbCritical
                    Exit Sub
                End If
                
                NewBr = GetAltFiskBrNoviBrojDok(Me.USifDV, Year(Me.DatumDokumenta), oonz(DokRS.Fields("SifVal"), ""), , _
                        oonz(DokRS.Fields("SifMjTr"), ""), oonz(DokRS.Fields("IzradilaSifOsobe"), ""), BrojDokZaSufiks, oonz(DokRS.Fields("SifPodruznice"), ""))
                
                .Fields(pom) = NewBr
                !AltFiskBrIntBrojDokumenta = BrojDokumentaToInt(NewBr, NewBrFormat, Me.USifDV.Column(0), oonz(DokRS.Fields("SifMjTr"), ""), oonz(DokRS.Fields("IzradilaSifOsobe"), ""), oonz(DokRS.Fields("SifPodruznice"), ""))
              Case "DatumZaIzvjestaje"
                ' ne treba ništa
              Case Else
                ' bj@23.01.2019. - Kopiraj datum opcije samo ako nije podešeno u dozvolama kopiranja
                If pom = "DatumOpcije" Then
                    If KopiDatOpcije = 0 Then
                        'provjeri da li se vidi DanCassa
                        Dim rDanCassa As Recordset, RokPl As Integer
                        Set rDanCassa = New Recordset
                        rDanCassa.Open "SELECT  DVPoljaDGL.CtrlName " & _
                          " FROM DVPoljaDGL INNER JOIN DVIzglediDGL ON DVPoljaDGL.SifIzgledaDGL = DVIzglediDGL.SifIzgledaDGL " & _
                          " WHERE DVIzglediDGL.SifIzgledaDGL = '" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
                          "' AND DVPoljaDGL.SifIzgledaDGL = '" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
                          "' AND DVPoljaDGL.CtrlName = 'DanCassa'", CurrentProject.Connection, adOpenStatic
                        
                        If rDanCassa.RecordCount > 0 Then
                          'hz 20210204 - nova logika za DatumOpcije, ako se vidi DGL.DanCassa
                          If DLookup("PovuciDef_Franko_Trans_IzPartDob", "DV", "SifDV='" & Me.USifDV & "'") = True Then
                            RokPl = Nz(DLookup("DanCassaDob", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), 0)
                          Else
                            RokPl = Nz(DLookup("DanCassa", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), 0)
                          End If
                          .Fields(pom) = DateSerial(Year(Me.DatumDokumenta), Month(Me.DatumDokumenta), _
                                        Day(Me.DatumDokumenta) + Int(RokPl))
                        Else
                          .Fields(pom) = DokRS.Fields(pom)
                        End If
                        
                        rDanCassa.Close
                        Set rDanCassa = Nothing
                        
    
                    End If
                Else
                    .Fields(pom) = DokRS.Fields(pom)
                End If
            End Select
            
            CtrlGlave.MoveNext
          Loop
          
          
          If Me.FrameUDok = UDOK_POSTOJECI Or Me.FrameUDok = UDOK_NOVI Then
            If Not hzProvjeriDupliBrojDokumenta(Me.USifDV, Me.UBrojDokumenta, Year(Me.DatumDokumenta), Me.SifVal) Then
              ooMsgbox "Već postoji dokument s ovim brojem."
              .CancelUpdate
              InitBrDok
              Exit Sub
            Else ' UDOK_REV
            End If
          End If
    
          'prije spuštanja u bazu provjeri da li su upisana sva required polja za odredišni dokument (ako je uključeno ChkRequired za ovu kombinaciju dokumenata)
          Dim rChk As Recordset, sChk As String
          If ChkRequired = True Then
            Set rChk = New Recordset
            rChk.Open " SELECT DVPoljaDGL.CtrlName, DVPoljaDGL.IsRequired " & _
                      " FROM DV INNER JOIN DVPoljaDGL ON DV.SifIzgledaDGL = DVPoljaDGL.SifIzgledaDGL " & _
                      " WHERE DV.SifDV = '" & Me.USifDV & "' AND IsRequired = 1 ", CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
            While Not rChk.EOF
              On Error Resume Next 'zato što u DVPoljaDGL ima i kontrola koji nisu fieldovi u bazi
              If ooisnull(R.Fields(CStr(rChk!CtrlName)).Value) Then
                If err = 0 Then sChk = sChk & rChk!CtrlName & ", "
              End If
              On Error GoTo Greska
              rChk.MoveNext
            Wend
            
            rChk.Close
            Set rChk = Nothing
            If sChk <> "" Then
              .CancelUpdate
              MNorm
              ooMsgbox "Kopiranje nije moguće jer u izvornom dokumentu nisu popunjena sljedeća polja koja su obavezna u odredišnom:" & vbCrLf & vbCrLf & Left(sChk, Len(sChk) - 2), vbExclamation + vbOKOnly
              Exit Sub
            End If
          End If
            
          .Update
          '.Bookmark = .LastModified 'keyset pamti DGLID
          DokID = !DGLID
          .Close
          
          mDB_Util.LogB "DGLKopi_Click", "After upis glave"
          
          'zaglavlje dokumenta kopirano - ako treba, povuci default napomene (ako postoje defaulti, pregazit će one nastale kopiranjem iz izvornog!)
          If PovuciDefaultNapomene = True Then CurrentProject.Connection.Execute "EXEC  spDGL_CopyDefaultNapomene " & DokID
    
          If KopirajPriloge = True Then
            CurrentProject.Connection.Execute " INSERT INTO Prilozi (DGLID, DatotekaPutanja, Napomena, Izvor, ZaERacun, ZaIspisUrOO)" & _
                                              " SELECT " & DokID & ", DatotekaPutanja, Napomena, Izvor, ZaERacun, ZaIspisUrOO " & _
                                              " FROM Prilozi " & _
                                              " WHERE DGLID = " & Me.IzBrojDokumenta
          End If
    
    
          'provjera odobrenosti dokumenta i zabrana unosa u GKS ako ima proces odobravanja za koji je postavljen flag NeodobrenZabraniKnjizenje
          Dim rOdobr As Recordset
          Set rOdobr = New Recordset
          rOdobr.Open "EXECUTE [spOdobr_NadjiProcesOdobr] " & DokID & ", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL", CurrentProject.Connection, adOpenStatic
          If rOdobr.RecordCount <> 0 Then
            If rOdobr!NeodobrenZabraniKnjizenje = True Then
              If Nz(DLookup("dbo.fnOdobr_ProvjeraOdobr(" & DokID & ", NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL)", "Korisnik"), "0") <> "2" Then
                CurrentProject.Connection.Execute "UPDATE DGL SET NeAskl = 1 WHERE DGLID = " & DokID
              End If
            End If
          End If
          rOdobr.Close
          Set rOdobr = Nothing
      
    
        End With
      Else
        'kopira se u postojeći dokument, zapamti samo ID glave, bez dodavanja u glavu
        If PozivSaSemafora = True And IsNull(Me.UBrojDokumentaC.Column(UBDC_DGLID)) = True And Nz(Me.UBrojDokumentaC, 0) > 0 Then
            DokID = Me.UBrojDokumentaC
        Else
            DokID = Me.UBrojDokumentaC.Column(UBDC_DGLID)
        End If
      End If
      
      
      'narudžbe naknadno (jer prije nije bilo DGLID-a)
      Dim NarID As Long
      
      NarID = 0
      
      Dim sOtv As Integer, DOtv As Integer, D_Z_ZaS As Boolean 'source otvarač, dest otvarač, D_Z_ZaS dest zatv za source
      Dim GbDT As String 'grupiraj po debeloj i tankoj, dodao IK 28.09.2009
      Dim KopiNarDGLIDUvijek As Boolean
      
      KopiNarDGLIDUvijek = DLookup("KopiNarDGLIDUvijek", "DGLKopiranjeDozvole", "IzSifDV = '" & Me.IzSifDV.Column(IZSDV_SifDV) & "' AND USifDV = '" & Me.USifDV.Column(USDV_SifDV) & "'")
      
      GbDT = IIf(Me.CboDT.Value = 1 Or Me.CboDT.Value = 2, " AND DST.S=" & Me.CboDT.Value, "")
      
      sOtv = DLookup("Nar", "DV", "SifDV='" & Me.IzSifDV.Column(IZSDV_SifDV) & "'")
      DOtv = DLookup("Nar", "DV", "SifDV='" & Me.USifDV.Column(USDV_SifDV) & "'")
      
      D_Z_ZaS = IIf(DLookup("NarSifDV", "DV", "SifDV='" & Me.USifDV.Column(IZSDV_SifDV) & "'") = Me.IzSifDV.Column(IZSDV_SifDV), True, False)
      
      If (sOtv <> 0 And D_Z_ZaS) Or KopiNarDGLIDUvijek = True Then NarID = Me.IzBrojDokumenta.Column(IZBD_DGLID)
      
      If sOtv <> 0 Or KopiNarDGLIDUvijek = True Then  ' then Me.cboNar.Column(0) <> cboNAR_SVE Then 'nije upisivao u DGL.NarDGLID za odabrane "sve stavke" -- na brk ML 2.9.2011
        
        'Provjeri da li je vidljiva kontrola na glavi odresišnog ako je kopiraj NARDGLID u glavu
        Dim rND As Recordset
        Set rND = New Recordset
        rND.Open "SELECT  DVPoljaDGL.CtrlName " & _
          " FROM DVPoljaDGL INNER JOIN DVIzglediDGL ON DVPoljaDGL.SifIzgledaDGL = DVIzglediDGL.SifIzgledaDGL " & _
          " WHERE DVIzglediDGL.SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
          "' AND DVPoljaDGL.SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & _
          "' AND DVPoljaDGL.CtrlName='NARDGLID'", CurrentProject.Connection, adOpenStatic
        
        If rND.RecordCount > 0 Or KopiNarDGLIDUvijek = True Then
          'ako se kopira u novi dokument, upiši NarDGLID u glavu; ako je kopiranje u postojeći dokument, kasnije kopiraj u stavku (DSTNarDGLID)
          If NarID <> 0 And Me.FrameUDok.Value = 1 Then CurrentProject.Connection.Execute _
                    " UPDATE DGL SET NarDGLID = " & NarID & " WHERE DGLID = " & DokID
        Else
          CopyNARIDUStavku = True
        End If
        rND.Close
        Set rND = Nothing
      End If
      
      'od sada se sve stavke izvornog dokumenta join-aju na proceduru spDST_CopyFIFO
      
      Dim TblIme As String
      TblIme = "tmp" & InitSystemUser & "DGLKopiranje"
      
      'ik 23.06.2015 u SCL-u se počeo javljati timeout pa smo dodali posebnu konekciju. Postavka za timeout nije funkcionirala
      '******************************************
      Dim cn As Connection
      Set cn = New Connection
      
      cn.CommandTimeout = 0
      cn.Open CurrentProject.Connection.ConnectionString
      
      If SerRaspisi = True Then
        cn.Execute "EXEC spUSR_SCL_SerRaspisi " & Me.IzBrojDokumenta & ", '" & TblIme & "', " & IIf(cboNar = cboNAR_SVE, "0", "1") & IIf(Rezervacije = True, ", 1", ", 0")
      ElseIf RaspisiPoPoziciji = True Then
        cn.Execute "EXEC sp_RaspisiPoPoziciji " & Me.IzBrojDokumenta & ", '" & TblIme & "', " & IIf(cboNar = cboNAR_SVE, "0", "1") & IIf(Rezervacije = True, ", 1", ", 0")
      Else
        cn.Execute "EXEC spDST_CopyFIFO " & Me.IzBrojDokumenta & ", " & Me.cboNar.Column(0) & ", " & IIf(NoMinKol = True, 1, 0) & _
            ", '" & Me.USifDV.Column(USDV_USifDV) & "', '" & TblIme & "'" & IIf(Rezervacije = True, ", 1", ", 0") & IIf(Me.CheckStorno.Value = True, ", 1", ", 0")
      End If
      
      
      If cn.Errors.Count > 0 Then
        ooMsgbox "Greška kod kreiranja " & TblIme & " tablice!" & cn.Errors(0) & vbCrLf & err.Description, vbExclamation + vbOKOnly
      End If
      On Error GoTo Greska
      
      cn.Close
      Set cn = Nothing
      'zatvori konekciju
      '******************************************
      
      Dim IzvorniJeZbirni As Boolean
      IzvorniJeZbirni = DLookup("IzvorniJeZbirni", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      If IzvorniJeZbirni = True Then
        NarJOIN = " INNER JOIN " & TblIme & " AS NarJoin ON DSTZbirni.DSTID = NarJOIN.DSTID "
      Else
        NarJOIN = " INNER JOIN " & TblIme & " AS NarJoin ON DST.DSTID = NarJOIN.DSTID "
      End If
        
      
      CtrlGlave.Close: DokRS.Close
      Set CtrlGlave = Nothing: Set DokRS = Nothing
      
      If DodajuWMSPoveznicu = True Then
        Dim isAdded As Boolean
        isAdded = DCount("*", "WMSVezaniDokumenti", "iDGLID = " & DokID & " AND vDGLID = " & Me.IzBrojDokumenta) > 0
        If isAdded = False Then
             CurrentProject.Connection.Execute " INSERT INTO WMSVezaniDokumenti (iDGLID, vDGLID)" & _
                                               " VALUES (" & DokID & "," & Me.IzBrojDokumenta & ")"
        
        End If
      
      End If
      
      'ako je kopiranje SAMO glave --> idi na kraj stavki MB 25.02.2020
      If Me.CheckSamoGlava Then GoTo StavkeEnd
      
      mDB_Util.LogB "DGLKopi_Click", "kraj glave"
      '########### kraj glave
      
      '########### početak stavki
      mDB_Util.LogB "DGLKopi_Click", "početak stavki"
      
      If Me.FrameSkladista.Value = SKL_DOK Then skl = "DST.SifSklad," Else skl = "'" & Me.SifSklad & "',"
      If Me.FrameMjTr.Value = MJTR_KOR Then mjtros = "'" & Me.SifMjTrST & "'," Else mjtros = "CASE WHEN DestDV.cwSifMjTr > 0 THEN DST.SifMjTr ELSE Null END,"
      If Me.FramePoz.Value = POZ_NEDEF Then Poz = "'#'," Else Poz = "DST.SifPoz,"
      
      Dim neKop As String
      neKop = Nz(DLookup("NeKopirati", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "XXX")
      'uzima ista polja iz DVPoljaST za source i dest. vrste dokumenta
      Set R = New Recordset
      
      R.Open " SELECT DVPST1.FieldName " & _
          " FROM DVPoljaST AS DVPST INNER JOIN DVPoljaST AS DVPST1 ON DVPST.FieldName = DVPST1.FieldName " & _
          " WHERE DVPST.SifDV='" & Me.IzSifDV & "' AND DVPST1.SifDV='" & Me.USifDV & "'" & _
          " AND DVPST.FieldName<>'C' AND DVPST1.FieldName<>'C' AND DVPST.FieldName <> 'SifAkcije' AND DVPST1.FieldName <> 'SifAkcije' ORDER BY DVPST1.Kolona,DVPST1.RedniBroj", CurrentProject.Connection, adOpenForwardOnly
          
      With R
        If neKop = "XXX" Then
          Do Until .EOF
            s = s & .Fields(0) & ","
            S2 = S2 & "DST." & .Fields(0) & ","
            .MoveNext
          Loop
        Else
          Do Until .EOF
            'If .Fields(0) <> neKop Then - hz: 20.1.2014 - proširenje NeKop s mogućnošću više unosa polja koje se ne žele kopirati
            If hzInstr(.Fields(0), neKop) = False Then
              s = s & .Fields(0) & ","
              S2 = S2 & "DST." & .Fields(0) & ","
            End If
            .MoveNext
          Loop
        End If
        .Close
      End With
      Set R = Nothing
      
      ' cijena
      s = s & "C,"
      Select Case Me.cboCijena
        Case 0 'ista
          S2 = S2 & "DST.C,"
        Case 1 '=0
          S2 = S2 & "0,"
        Case 2 'preračun po tečaju
          S2 = S2 & "DST.C" & _
                " *( SELECT Tcj FROM DGL INNER JOIN TL ON" & _
                " DGL.DatumDokumenta=TL.DatumTecaja And DGL.SifVal=TL.SifVal WHERE DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID) & ")" & _
                " / (SELECT Tcj FROM DGL INNER JOIN TL ON" & _
                " DGL.DatumDokumenta=TL.DatumTecaja And DGL.SifVal=TL.SifVal WHERE DGLID=" & DokID & "),"
    
        Case 3, 4, 5 'defcij 1,2,3 iz artikla
          S2 = S2 & "Artikli.DefCij" & Me.cboCijena - 2 & ","
          
        Case 6 'preračun po tečaju (obrnuto)
          S2 = S2 & "DST.C" & _
                " * (SELECT Tcj FROM DGL INNER JOIN TL ON" & _
                " DGL.DatumDokumenta=TL.DatumTecaja And DGL.SifVal=TL.SifVal WHERE DGLID=" & DokID & ")" & _
                " / (SELECT Tcj FROM DGL INNER JOIN TL ON" & _
                " DGL.DatumDokumenta=TL.DatumTecaja And DGL.SifVal=TL.SifVal WHERE DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID) & "),"
        
        Case 7, 8, 9, 10 'Koef1-4 iz Artikla
          S2 = S2 & "COALESCE(Artikli.Koef" & Me.cboCijena - 6 & ",0),"
          
        Case 11 'ik 21.08.2015 - dodana mogućnost prijepisa cijene iz kalkulativnog polja
          Dim KalkIzraz As String
          KalkIzraz = oonz(DLookup("xSQL", "DVPoljaST", "SifDV='" & Me.IzSifDV & "' AND CijenaZaKopiranje=1"), "")
          If KalkIzraz = "" Then
            ooMsgbox "Nije označena cijena za kopiranje u izvornom dokumentu!" & vbCrLf & "Kopirati će se cijena 0!" & vbCrLf & "Promijenite definiciju izvornog dokumenta!", vbInformation
            KalkIzraz = "0"
          End If
          S2 = S2 & KalkIzraz & ","
        
      End Select
      ' *****
      
      s = Left(s, Len(s) - 1)
      S2 = Left(S2, Len(S2) - 1)
      
      'ako je STORNO, dodaj *(-1) za količinu (u s2)
      Dim PozKol, PozKol2st As Variant 'pozicija unutar stringa gdje se pojavljuje Kol
      If Me.CheckStorno Then
        PozKol = InStr(S2, "Kol,")
        If Not IsNull(PozKol) And PozKol <> 0 Then
          S2 = Left(S2, PozKol + 2) & "*(-1)" & Mid(S2, PozKol + 3)
        End If
        
        PozKol2st = InStr(S2, "Kol2")
        If Not IsNull(PozKol2st) And PozKol2st <> 0 Then
          S2 = Left(S2, PozKol2st + 3) & "*(-1)" & Mid(S2, PozKol2st + 4)
        End If
        
      End If
      
      'ako je za ovaj par dokumenata označena opcija Kol2UKol (za repromaterijal, kopira kol2 (vaganu količinu) s carinskog skladišta u pravu količinu prilikom zaprimanja na "pravo" skladište
      Kol2UKol = DLookup("Kol2UKol", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      If Kol2UKol = True Then
        PozKol = InStr(S2, "Kol")
        If Not IsNull(PozKol) And PozKol <> 0 Then
          S2 = Left(S2, PozKol + 2) & "2" & Mid(S2, PozKol + 3)
        End If
      End If
      
      'Kol3uKol2
      If Kol3uKol2 = True Then
        'ik 27.04.2017 - stari kod koji je bio niže u porceduri. Nije radio ako na odredišnom dokumentu nije bio otkriven KOL3
        'CurrentProject.Connection.Execute "UPDATE DST SET Kol2 = Kol3, Kol3 = 0  WHERE DGLID = " & DokID
        PozKol = 0
        PozKol = InStr(S2, "Kol2")
        'ako je kol2 vidljiv o oba dokumenta onda ćemo popuniti KOL3 u KOL2
        If Not IsNull(PozKol) And PozKol <> 0 Then
          S2 = Left(S2, PozKol + 2) & "3" & Mid(S2, PozKol + 4)
        Else
          s = s & ", Kol2"
          S2 = S2 & ", DST.Kol3"
        End If
      End If
    
        'kopiraj samo stavke za koje je u Artiklu.Kontrola neko
      
      KopiSamoKontr = Nz(DLookup("KopiSamoKontr", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      If KopiSamoKontr <> "" Then
        sKopiSamoKontr = " ("
        For i = 1 To Len(KopiSamoKontr)
          sKopiSamoKontr = sKopiSamoKontr & "'" & Mid(KopiSamoKontr, i, 1) & "', "
        Next i
        sKopiSamoKontr = Left(sKopiSamoKontr, Len(sKopiSamoKontr) - 2)
        sKopiSamoKontr = sKopiSamoKontr & ") "
        
      End If
      
      'stavke koje su u artiklu.Kontrola označene kao A ili K, kopiraj na skladište KopiKontrAKNaSkl
      'pozicija se za ovo skladište kopira uvijek #
      KopiKontrAKNaSkl = Nz(DLookup("KopiKontrAKNaSkl", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      If KopiKontrAKNaSkl <> "" Then
        'u stringu skl se nalazi DST.SifSklad ili konkretno skladište upisano na formi
        'napravi replace s KopiKontrAKNaSkl ako skladište nije odabrano na formi
        'TK 6.12.2012. samo za debele stavke
        skl = Replace(skl, "DST.SifSklad", "CASE WHEN (Artikli.Kontrola = 'A' OR Artikli.Kontrola = 'K') AND DST.S=1 THEN '" & KopiKontrAKNaSkl & "' ELSE DST.SifSklad END")
      End If
      
      PozKol = InStr(S2, "Kol,") '19.2.2018. dodan "," jer je inače radio Replace DST.Kol2!!!
      If PozKol = 0 Then
        PozKol = InStr(S2, "Kol*(-1),")
      End If
    
      If Not IsNull(PozKol) And PozKol <> 0 And Kol2UKol = False Then
      ' MB 27.12.2021. Na zahtjev Filip Grgetić za COMMEL: Dodano kako bi se kopirale negativne stavke
        If IzSifDV = "REKd" And USifDV = "POVd" Then
            S2 = Left(S2, PozKol - 5) & "(NarJOIN.PKol)" & Mid(S2, PozKol + 3)
        Else
        'S2 = Left(S2, PozKol - 5) & "(NarJOIN.IKol)" & Mid(S2, PozKol + 3 + IIf(Kol2UKol = True, 1, 0)) ' u IKol je uvijek količina koju treba prikazati
            S2 = Left(S2, PozKol - 5) & "(NarJOIN.IKol)" & Mid(S2, PozKol + 3) 'u IKol je uvijek količina koju treba prikazati; 19.2.2018; maknut IIF jer je Kol2UKol uvijek False, pa ovdje nema što ispitivati
        End If
      End If
      
      Dim PozKol2 As Variant
      PozKol2 = InStr(S2, "Kol2")
      If Not IsNull(PozKol2) And PozKol2 <> 0 And cboNar = cboNAR_SVEISP Then
        S2 = Left(S2, PozKol2 - 5) & "(NarJOIN.IKol2)" & Mid(S2, PozKol2 + 4)
      End If
    
      'S za kopiranje iz DT u neDT
      If Me.CboDT.enabled = True Then
        If Me.CboDT.Value = 1 Or Me.CboDT.Value = 2 Then wS = " AND DST.S=" & Me.CboDT.Value
      End If
      
      Dim KopiVezaSifArt As Boolean
      KopiVezaSifArt = DLookup("KopiVezaSifArt", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      PlusUJednako = DLookup("PlusUJednako", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      NeKopiSamoSkladZaOper = ""
      Dim rSecOper As Recordset
      Set rSecOper = New Recordset
      rSecOper.Open "SELECT SifSklad FROM DGLKopiranjeDozvoleSecOper WHERE IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "' AND KorIme='" & gKorIme & "'", CurrentProject.Connection, adOpenForwardOnly
      
      If rSecOper.RecordCount > 0 Then
        While Not rSecOper.EOF
          NeKopiSamoSkladZaOper = NeKopiSamoSkladZaOper & "'" & rSecOper!SifSklad & "', "
          rSecOper.MoveNext
        Wend
        NeKopiSamoSkladZaOper = Left(NeKopiSamoSkladZaOper, Len(NeKopiSamoSkladZaOper) - 2)
      End If
      
      rSecOper.Close
      Set rSecOper = Nothing
      
      'ik 03.05.2017 - SmijeUlaze i SmijeIzlaze
      ' - ovjde nećemo ispitivati status svake stavke nego ćemo na razini smjera dokumenta zaključiti da li je ulaz ili izlaz
      ' - međuskladišnica će ispitivati sve kombinacije
      ' - kopiranje stablastih dokumenata sa rasparenim smjerovima se provjerava generalno kao SmijeIzlaz
      Dim SecSkladista As String, SecUvjet As String
      SecSkladista = ""
      'MB 16.05.2017 Dodano zbog ulazne kontrole u Gimu, ulazna kontrola nema prava mijenjati skladišta koja sa na izvornome dokumentu ali moraju moći kopirati stavke.
      If DLookup("Askl", "DV", "SifDV='" & Me.USifDV & "'") = True And DCount("*", "SecSkl", "SifGrupe=" & gsifgrupe) > 0 And DLookup("NeSecSkl", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = False Then
        If DLookup("UI", "DV", "SifDV='" & Me.USifDV & "'") = 3 Then 'samo čisti ulaz UU smatramo ulazom
          SecUvjet = " AND SmijeUlaz=1"
        Else
          SecUvjet = " AND SmijeIzlaz=1"
        End If
        
        Dim rSecSkladista As Recordset
        Set rSecSkladista = New Recordset
        rSecSkladista.Open "SELECT SifSklad FROM SecSkl WHERE SifGrupe=" & gsifgrupe & SecUvjet, CurrentProject.Connection, adOpenForwardOnly
        
        If rSecSkladista.RecordCount > 0 Then
          While Not rSecSkladista.EOF
            SecSkladista = SecSkladista & "'" & rSecSkladista!SifSklad & "', "
            rSecSkladista.MoveNext
          Wend
          SecSkladista = Left(SecSkladista, Len(SecSkladista) - 2)
        End If
        
        rSecSkladista.Close
        Set rSecSkladista = Nothing
      End If
     
      'kopiraj stavke
    
      'hz 11.2.2017
      If DCount("*", "DGLKopiranjeDozvoleArtikliGrupe", "IzSifDV='" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "'") > 0 Then
        wS = " AND (Artikli.SifGrupe IN (SELECT SifGrupe FROM DGLKopiranjeDozvoleArtikliGrupe WHERE SifGrupe IS NOT NULL AND IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "') OR " & _
             "     Artikli.SifGrupe2 IN (SELECT SifGrupe2 FROM DGLKopiranjeDozvoleArtikliGrupe WHERE SifGrupe2 IS NOT NULL AND IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "') OR " & _
             "     Artikli.SifGrupe3 IN (SELECT SifGrupe3 FROM DGLKopiranjeDozvoleArtikliGrupe WHERE SifGrupe3 IS NOT NULL AND IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "') OR " & _
             "     Artikli.SifGrupe4 IN (SELECT SifGrupe4 FROM DGLKopiranjeDozvoleArtikliGrupe WHERE SifGrupe4 IS NOT NULL AND IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "')" & _
             "     ) "
      End If
      
      'If DLookup("KopirajDefSifPoz", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = True Then Poz = "COALESCE(Artikli.DefSifPoz, '#'),"
      If DLookup("KopirajDefSifPoz", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = True Then
        Poz = " CASE WHEN DST.SifSklad = Artikli.DefSifSklad THEN COALESCE(Artikli.DefSifPoz, '#') ELSE DST.SifPoz END,"
      End If
      
      If Me.IzSifDV.Column(IZSDV_MS) = True And Me.USifDV.Column(USDV_MS) = True Then
        'međuskl u međuskl
        CurrentProject.Connection.Execute "EXEC spDST_CopyM " & Me.IzBrojDokumenta & ", " & DokID & ", " & IIf(Me.CheckStorno.Value = True, 1, 0) & _
                                      ", '" & gKorIme & IIf(Me.cboNar.Column(0) = 0, "','' ", "'," & TblIme) & _
                                      ", " & IIf(ooisnull(Me.SifSklad), "NULL", "'" & Me.SifSklad & "'") & _
                                      ", " & IIf(ooisnull(Me.SifSklad2), "NULL", "'" & Me.SifSklad2 & "'") & _
                                      ", " & IIf(ooisnull(Me.CboKopiSamoSaSklad), "NULL", "'" & Me.CboKopiSamoSaSklad & "'")
        
      Else
        Dim e As String
        If IzvorniJeZbirni = True Then
            'izvorni dokument je zbirni (pokupio je sve otvoreno npr. s NARd od nekog partnera, na tom dokumentu su možda ručno intervenirali i sad treba kopirati iz DST...
            '...sve što je na tom dokumentu (JOIN originalni DST-ovi iz kojeg treba uzeti podatke)
            'izdvojeno od normalnog kopiranja, da ne napravim neku bug svima...
          e = " INSERT INTO DST (DGLID, S, TrosRbr, SifArt, DSTDatum, DSTNarDD, DSTBarCode, DSTKatBr, DSTSifArtDob, DSTSifPred, DSTSifVrOp, " & _
              " SifSer, OpisArtikla,  SifSklad, SifPoz, SifMjTr," & s & _
              ", DSTNarDGLID" & IIf(SifSklad2Edit <> "", ", SifSklad2", "") & ",DSTETOID, ZaGKSSifArt, SifDSTVrste, SifDSTVrste2, DSTSifOsobe, DSTEGLID, IS_SifZemljePodrijetla, SifAkcije, DSTSifPartnera, SifSkladIzvDok, KopiranIzDSTID, DSTDatum2, DSTDatum3, DSTDatum4, SifGrupeGKS " & ")" & _
              " SELECT " & DokID & "," & IIf(Me.CboDT.enabled, "1", "DST.S") & ", DST.TrosRbr, " & _
              IIf(KopiVezaSifArt = True, " COALESCE(Artikli.VezaSifArt, DST.SifArt), ", " DST.SifArt,") & _
              IIf(hzInstr("DSTDatum", neKop) = True, "NULL", "DST.DSTDatum") & ", " & IIf(hzInstr("DSTNarDD", neKop) = True, "NULL", " DST.DSTNarDD") & ", " & _
              " CASE WHEN DestDV.cwDSTBarCode > 0 THEN DST.DSTBarCode ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTKatBr > 0 THEN DST.DSTKatBr ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTSifArtDob > 0 THEN DST.DSTSifArtDob ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTSifPred > 0 THEN DST.DSTSifPred ELSE Null END, DST.DSTSifVrOp,  " & _
              " DST.SifSer, DST.OpisArtikla,  " & IIf(SklUvijek <> "", "'" & SklUvijek & "',", skl) & Poz & mjtros & S2 & _
              "," & IIf(DLookup("cwDSTNarDGLID", "DV", "SifDV='" & Me.USifDV & "'") > 0, "DST.DGLID", "Null") & IIf(SifSklad2Edit <> "", ", '" & SifSklad2Edit & "'", "") & _
              ",DST.DSTETOID, DST.ZaGKSSifArt, DST.SifDSTVrste, DST.SifDSTVrste2, CASE WHEN DestDV.cwDSTSifOsobe > 0 THEN DST.DSTSifOsobe ELSE Null END, DST.DSTEGLID, DST.IS_SifZemljePodrijetla, DST.SifAkcije, DST.DSTSifPartnera, DST.SifSklad, DST.DSTID, "
          
          
          e = e & " CASE WHEN DestDV.cwDSTDatum2 > 0 THEN DST.DSTDatum2 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwDSTDatum3 > 0 THEN DST.DSTDatum3 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwDSTDatum4 > 0 THEN DST.DSTDatum4 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwSifGrupeGKS > 0 THEN DST.SifGrupeGKS ELSE Null END "
    
          
          e = e & " FROM DST DSTZbirni INNER JOIN DST ON DSTZbirni.Opis1 = DST.DSTID INNER JOIN Artikli ON DST.SifArt=Artikli.SifArt INNER JOIN Skladista ON DST.SifSklad = Skladista.SifSklad " & _
              " INNER JOIN DGL ON DGL.DGLID = DST.DGLID INNER JOIN DV ON DGL.SifDV=DV.SifDV " & _
              NarJOIN & _
              ", (SELECT cwDSTBarCode, cwDSTSifPred, cwDSTKatBr, cwDSTSifArtDob, cwSifMjTr, cwDSTSifOsobe, cwDSTDatum2, cwDSTDatum3, cwDSTDatum4, cwSifGrupeGKS FROM DV WHERE SifDV = '" & Me.USifDV & "') DestDV " & _
              " WHERE DSTZbirni.DGLID =" & Me.IzBrojDokumenta & _
              wS & _
              IIf(Me.FrameSkladista.Value = SKL_DOK, " AND DST.SifSklad IN (SELECT SifSklad FROM DVSkladista WHERE SifDV = '" & Me.USifDV.Column(USDV_SifDV) & "') ", "") & _
              IIf(KopiSamoSkl <> "", " AND DST.SifSklad='" & KopiSamoSkl & "'", "") & _
              IIf(Not IsNull(Me.CboKopiSamoSaSklad), " AND DST.SifSklad = '" & Me.CboKopiSamoSaSklad & "'", "") & _
              IIf(KopiSamoKontr <> "", " AND Artikli.Kontrola IN " & sKopiSamoKontr, "") & _
              IIf(NeKopiSamoSkladZaOper <> "", " AND DST.SifSklad NOT IN (" & NeKopiSamoSkladZaOper & ")", "") & _
              IIf(SecSkladista <> "", " AND DST.SifSklad IN (" & SecSkladista & ")", "") & _
              " ORDER BY DGL.DatumDokumenta, DGL.BrojDokumenta, DST.DSTOrd "
        
        ElseIf SerRaspisi = True Or RaspisiPoPoziciji = True Then
         
          e = " INSERT INTO DST (DGLID, S, TrosRbr, SifArt, DSTDatum, DSTNarDD, DSTBarCode, DSTKatBr, DSTSifArtDob, DSTSifPred, DSTSifVrOp, DSTSifVrOpRazrade, " & _
              " SifSer, OpisArtikla,  SifSklad, SifPoz, SifMjTr," & s & _
              ", DSTNarDGLID" & IIf(SifSklad2Edit <> "", ", SifSklad2", "") & ",DSTETOID, SifDSTVrste, SifDSTVrste2, ZaGKSSifArt, DSTSifOsobe, DSTEGLID, DSTObjektID, IS_SifZemljePodrijetla, SifAkcije, DSTSifPartnera, SifSkladIzvDok, KopiranIzDSTID, DSTDatum2, DSTDatum3, DSTDatum4, SifGrupeGKS, IDUgovorneStavke " & ")" & _
              " SELECT " & DokID & "," & IIf(Me.CboDT.enabled Or PlusUJednako = True, "1", "S") & ", DST.TrosRbr, " & _
              IIf(KopiVezaSifArt = True, " COALESCE(Artikli.VezaSifArt, DST.SifArt), ", " DST.SifArt,") & _
              IIf(hzInstr("DSTDatum", neKop) = True, "NULL", IIf(RaspisiPoPoziciji = True, "DST.DSTDatum", "NarJOIN.DatIsteka")) & ", " & IIf(hzInstr("DSTNarDD", neKop) = True, "NULL", " DST.DSTNarDD") & ", " & _
              " CASE WHEN DestDV.cwDSTBarCode > 0 THEN DST.DSTBarCode ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTKatBr > 0 THEN DST.DSTKatBr ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTSifArtDob > 0 THEN DST.DSTSifArtDob ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTSifPred > 0 THEN DST.DSTSifPred ELSE Null END, DST.DSTSifVrOp, DST.DSTSifVrOpRazrade, " & _
              IIf(RaspisiPoPoziciji = True, "DST.SifSer", " NarJOIN.SifSer") & ", DST.OpisArtikla,  " & IIf(SklUvijek <> "", "'" & SklUvijek & "',", skl) & IIf(RaspisiPoPoziciji = True, " NarJoin.SifPoz , ", Poz) & mjtros & S2 & _
              "," & IIf(NarID <> 0 And (Me.FrameUDok.Value = 2 Or CopyNARIDUStavku = True) And DLookup("cwDSTNarDGLID", "DV", "SifDV='" & Me.USifDV & "'") > 0, NarID, "Null") & IIf(SifSklad2Edit <> "", ", '" & SifSklad2Edit & "'", "") & _
              ",DST.DSTETOID, DST.SifDSTVrste, DST.SifDSTVrste2, DST.ZaGKSSifArt, " & IIf(hzInstr("DSTDatum", neKop) = True, "NULL", "CASE WHEN DestDV.cwDSTSifOsobe > 0 THEN DST.DSTSifOsobe ELSE Null END") & _
              ", DST.DSTEGLID, DST.DSTObjektID, DST.IS_SifZemljePodrijetla, DST.SifAkcije, DST.DSTSifPartnera, DST.SifSklad, DST.DSTID, "
    
          e = e & " CASE WHEN DestDV.cwDSTDatum2 > 0 THEN DST.DSTDatum2 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwDSTDatum3 > 0 THEN DST.DSTDatum3 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwDSTDatum4 > 0 THEN DST.DSTDatum4 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwSifGrupeGKS > 0 THEN DST.SifGrupeGKS ELSE Null END, " & _
                  " CASE WHEN DestDV.cwIDUgovorneStavke > 0 THEN DST.IDUgovorneStavke ELSE Null END "
                  
          
          e = e & " FROM DST INNER JOIN Artikli ON DST.SifArt=Artikli.SifArt INNER JOIN Skladista ON DST.SifSklad = Skladista.SifSklad " & _
              " INNER JOIN DGL ON DGL.DGLID = DST.DGLID INNER JOIN DV ON DGL.SifDV=DV.SifDV " & _
              NarJOIN & _
              ", (SELECT cwDSTBarCode, cwDSTSifPred, cwDSTKatBr, cwDSTSifArtDob, cwSifMjTr, cwDSTSifOsobe, cwDSTDatum2, cwDSTDatum3, cwDSTDatum4, cwSifGrupeGKS, cwIDUgovorneStavke FROM DV WHERE SifDV = '" & Me.USifDV & "') DestDV " & _
              " WHERE DST.DGLID=" & Me.IzBrojDokumenta & _
              wS & _
              IIf(Me.FrameSkladista.Value = SKL_DOK, " AND DST.SifSklad IN (SELECT SifSklad FROM DVSkladista WHERE SifDV = '" & Me.USifDV.Column(USDV_SifDV) & "') ", "") & _
              IIf(KopiSamoSkl <> "", " AND DST.SifSklad='" & KopiSamoSkl & "'", "") & _
              IIf(Not IsNull(Me.CboKopiSamoSaSklad), " AND DST.SifSklad = '" & Me.CboKopiSamoSaSklad & "'", "") & _
              IIf(KopiSamoKontr <> "", " AND Artikli.Kontrola IN " & sKopiSamoKontr, "") & _
              IIf(NeKopiSamoSkladZaOper <> "", " AND DST.SifSklad NOT IN (" & NeKopiSamoSkladZaOper & ")", "") & _
              IIf(SecSkladista <> "", " AND DST.SifSklad IN (" & SecSkladista & ")", "") & _
            " ORDER BY DSTOrd "
        Else
          e = " INSERT INTO DST (DGLID, S, TrosRbr, SifArt, DSTDatum, DSTNarDD, DSTBarCode, DSTKatBr, DSTSifArtDob, DSTSifPred, DSTSifVrOp, DSTSifVrOpRazrade,  " & _
              " SifSer, OpisArtikla,  SifSklad, SifPoz, SifMjTr," & s & _
              ", DSTNarDGLID" & IIf(SifSklad2Edit <> "", ", SifSklad2", "") & ",DSTETOID, SifDSTVrste, SifDSTVrste2, ZaGKSSifArt, DSTSifOsobe, DSTEGLID, DSTObjektID, IS_SifZemljePodrijetla, SifAkcije, ProjektWBSID, SifJMJu, DSTSifPartnera, SifSkladIzvDok, KopiranIzDSTID, DSTDatum2, DSTDatum3, DSTDatum4, SifGrupeGKS, IDUgovorneStavke " & ")" & _
              " SELECT " & DokID & "," & IIf(Me.CboDT.enabled Or PlusUJednako = True, "1", "S") & ", DST.TrosRbr, " & _
              IIf(KopiVezaSifArt = True, " COALESCE(Artikli.VezaSifArt, DST.SifArt), ", " DST.SifArt,") & _
              IIf(hzInstr("DSTDatum", neKop) = True, "NULL", "DST.DSTDatum") & ", " & IIf(hzInstr("DSTNarDD", neKop) = True, "NULL", " DST.DSTNarDD") & ", " & _
              " CASE WHEN DestDV.cwDSTBarCode > 0 THEN DST.DSTBarCode ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTKatBr > 0 THEN DST.DSTKatBr ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTSifArtDob > 0 THEN DST.DSTSifArtDob ELSE Null END, " & _
              " CASE WHEN DestDV.cwDSTSifPred > 0 THEN DST.DSTSifPred ELSE Null END, DST.DSTSifVrOp, DST.DSTSifVrOpRazrade, " & _
              " DST.SifSer, DST.OpisArtikla, " & IIf(SklUvijek <> "", "'" & SklUvijek & "',", skl) & Poz & mjtros & S2 & _
              "," & IIf(NarID <> 0 And (Me.FrameUDok.Value = 2 Or CopyNARIDUStavku = True) And DLookup("cwDSTNarDGLID", "DV", "SifDV='" & Me.USifDV & "'") > 0, NarID, "Null") & IIf(SifSklad2Edit <> "", ", '" & SifSklad2Edit & "'", "") & _
              ",DST.DSTETOID, DST.SifDSTVrste, DST.SifDSTVrste2, DST.ZaGKSSifArt, " & IIf(hzInstr("DSTDatum", neKop) = True, "NULL", "CASE WHEN DestDV.cwDSTSifOsobe > 0 THEN DST.DSTSifOsobe ELSE Null END") & ", DST.DSTEGLID, DST.DSTObjektID, DST.IS_SifZemljePodrijetla," & _
              IIf((DCount("*", "AkcijeDV", "SifDV = '" & Me.USifDV & "'") > 0 Or DLookup("PrimijeniAkcijuNaAftUpdStavke", "DV", "SifDV = '" & Me.USifDV & "'") = True _
              Or DLookup("PrimijeniAkcijuNaAftUpdStavkeSilent", "DV", "SifDV = '" & Me.USifDV & "'") = True), " DST.SifAkcije", " NULL") & _
              ", CASE WHEN DestDV.cwProjektWBSID > 0 THEN DST.ProjektWBSID ELSE Null END, DST.SifJMJu, DST.DSTSifPartnera, DST.SifSklad, DST.DSTID,"
          
          
          e = e & " CASE WHEN DestDV.cwDSTDatum2 > 0 THEN DST.DSTDatum2 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwDSTDatum3 > 0 THEN DST.DSTDatum3 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwDSTDatum4 > 0 THEN DST.DSTDatum4 ELSE Null END, " & _
                  " CASE WHEN DestDV.cwSifGrupeGKS > 0 THEN DST.SifGrupeGKS ELSE Null END, " & _
                  " CASE WHEN DestDV.cwIDUgovorneStavke > 0 THEN DST.IDUgovorneStavke ELSE Null END "
    
          e = e & " FROM DST INNER JOIN Artikli ON DST.SifArt=Artikli.SifArt INNER JOIN Skladista ON DST.SifSklad = Skladista.SifSklad " & _
              " INNER JOIN DGL ON DGL.DGLID = DST.DGLID INNER JOIN DV ON DGL.SifDV=DV.SifDV " & _
              NarJOIN & _
              ", (SELECT cwDSTBarCode, cwDSTSifPred, cwDSTKatBr, cwDSTSifArtDob, cwProjektWBSID, cwSifMjTr, cwDSTSifOsobe, cwDSTDatum2, cwDSTDatum3, cwDSTDatum4, cwSifGrupeGKS, cwIDUgovorneStavke FROM DV WHERE SifDV = '" & Me.USifDV & "') DestDV " & _
              " WHERE DST.DGLID=" & Me.IzBrojDokumenta & _
              wS & _
              IIf(Me.FrameSkladista.Value = SKL_DOK, " AND DST.SifSklad IN (SELECT SifSklad FROM DVSkladista WHERE SifDV = '" & Me.USifDV.Column(USDV_SifDV) & "') ", "") & _
              IIf(KopiSamoSkl <> "", " AND DST.SifSklad='" & KopiSamoSkl & "'", "") & _
              IIf(Not IsNull(Me.CboKopiSamoSaSklad), " AND DST.SifSklad = '" & Me.CboKopiSamoSaSklad & "'", "") & _
              IIf(KopiSamoKontr <> "", " AND Artikli.Kontrola IN " & sKopiSamoKontr, "") & _
              IIf(NeKopiSamoSkladZaOper <> "", " AND DST.SifSklad NOT IN (" & NeKopiSamoSkladZaOper & ")", "") & _
              IIf(SecSkladista <> "", " AND DST.SifSklad IN (" & SecSkladista & ")", "") & _
              " ORDER BY DSTOrd "
              
        End If
        
        CurrentProject.Connection.Execute e
        
        'ako je odredišni dokument DT i odabran je automatski prijepis normativa, za sve stavke pokušaj pronaći normativ i potpiši ga
        If CBool(Me.USifDV.Column(USDV_DT)) And AutoTeh Then
          Set R = New Recordset
          R.Open " SELECT DSTID FROM DST WHERE S = 1 AND DGLID = " & DokID & _
                 " AND DSTID NOT IN (SELECT ParentDSTID FROM DST WHERE DGLID = " & DokID & " AND ParentDSTID IS NOT NULL)", CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
          'za razmisliti: ovim se uzimaju SVE stavke pod glavom, pa će se potpisati i normativi za evntl. već postojeće stavke...
          '... a i za one koje imaju već pripadajuće tanke stavke (ali im još nije upisan ParentDSTID kojeg naknadno upisuje preknjižavanje)
          'možda dodati i ovakvo grupno raspisivanje iz DGL
          While Not R.EOF
            On Error Resume Next
            DoCmd.OpenForm "DokCopyTeh", , , , , , R!DSTID
            On Error GoTo 0
            MNorm
            While FormIsOpen("DokCopyTeh")
              'ništa
              DoEvents
            Wend
            R.MoveNext
          Wend
          R.Close
          Set R = Nothing
        End If
        
      End If
      
      On Error GoTo Greska
      
      'ako je odredišni dokument MS, a izvorišni ne, unesi i kontrastavku - kod prepisan iz DST.AfterInsert
      If Me.USifDV.Column(USDV_MS) = True And Me.IzSifDV.Column(IZSDV_MS) = False And Me.FrameUDok = UDOK_NOVI Then
        CurrentProject.Connection.Execute "INSERT INTO DST (DGLID, S, SifSklad, SifPoz, SifArt, SifSer, DSTDatum, DSTNarDD, Duljina, Sirina, Kol, Kol2, ParentDSTID, C, PPorez1, PRabatI, DSTSifOsobe, ProjektWBSID)" & _
          " SELECT DGLID, 2, SifSklad2, CASE WHEN SifPoz2 IS NULL THEN '#' ELSE SifPoz2 END, SifArt, SifSer, DSTDatum, DSTNarDD, Duljina, Sirina, " & IIf(Me.USifDV.Column(USDV_UI) = 0 Or Me.USifDV.Column(USDV_UI) = 3, "(-1)*", "") & "Kol, Kol2, DSTID, C, PPorez1, PRabatI, DSTSifOsobe, ProjektWBSID FROM DST WHERE DGLID=" & DokID
      End If
      
      'SerStisni: iskopirane stavke, grupiraj po artiklu, skladištu, poziciji, sumiraj količine i stavi sve na nepoznatu seriju
      If DLookup("SerStisni", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = True Then
        CurrentProject.Connection.Execute "EXEC spDST_SerStisni " & DokID
      End If
      
      If DLookup("SumArtPoDefDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = True Then
        CurrentProject.Connection.Execute "EXEC spDST_SumArtPoDefDok " & DokID
      End If
      
      
      'ako je odredišni dokument DT, pokreni spSkl_DT za taj dokument da se odmah uspostavi stablo (23.8.2012 - hz)
      If Me.USifDV.Column(USDV_DT) = True Then CurrentProject.Connection.Execute "EXEC spSkl_DT " & DokID
       
      'izračunaj korekciju PDV-a na odredišnom dokumentu, kad se napravi storno kopiranje, korektiv treba biti suprotnog predznaka
      RacunajPDVPoZagl (DokID)
      
      mDB_Util.LogB "DGLKopi_Click", "gotove stavke"
      '########### gotove stavke
      
      'nakon uspješnog kopiranja stavki, postavi označen na true u izvornom dokumentu (ako je tako označeno u dozvolama za kopiranje)
      'hz 2021011- ako nema stavaka u odredišnom, pitaj da li uopće žele zaglavlje - ako ne žele, onda obriši i završi kopiranje
      If DCount("*", "DST", "DGLID=" & DokID) = 0 Then
        If ooMsgbox("PAŽNJA: odredišni dokument ne sadrži niti jednu stavku!" & vbCrLf & "Želite li prekinuti kopiranje (neće se kreirati niti zaglavlje dokumenta)?", vbQuestion + vbYesNo) = vbYes Then
          CurrentProject.Connection.Execute "DELETE FROM DGL WHERE DGLID = " & DokID
          MNorm
          Exit Sub
        End If
      End If
      
    StavkeEnd:
      
      If SetOznacenuIzvornom = True Then
        If IzvorniJeZbirni = False Then
          If ProvjeraDatumZakZat = "" Then CurrentProject.Connection.Execute "UPDATE DGL SET Oznacen = 1 WHERE DGLID = " & Me.IzBrojDokumenta
        Else
          If ProvjeraDatumZakZat = "" Then CurrentProject.Connection.Execute "UPDATE DGL SET Oznacen = 1 WHERE DGLID IN (SELECT DISTINCT DST2.DGLID FROM DST INNER JOIN DST DST2 ON DST.Opis1 = DST2.DSTID WHERE DST.DGLID = " & Me.IzBrojDokumenta & ")"
        End If
      End If
      
      If IzvorniJeZbirni = False Then
        If BrojDokumentaU <> "" And BrojDokumentaU <> "BrojDokumenta" Then CurrentProject.Connection.Execute "UPDATE DGL SET " & BrojDokumentaU & " = '" & _
                                                                                                           Me.IzSifDV.Column(IZSDV_SifDV) & "-" & Me.IzBrojDokumenta.Column(IZBD_BrojDokumenta) & "-" & Me.IzBrojDokumenta.Column(IZBD_DatumDokumenta) & _
                                                                                                           "' WHERE DGLID = " & DokID
      End If
      
      If IzvorniJeZbirni = False Then
        If DatumDokumentaU <> "" And DatumDokumentaU <> "DatumDokumenta" Then CurrentProject.Connection.Execute "UPDATE DGL SET " & DatumDokumentaU & " = " & _
                                                                                                           sqldate(Me.IzBrojDokumenta.Column(IZBD_DatumDokumenta)) & _
                                                                                                           " WHERE DGLID = " & DokID
      End If
      
      'Postavi status izvornom dokumentu ako je označeno tako
        If StatusIzvDokID > 0 Then
          Dim ProvjeriIznimke As Boolean
          ProvjeriIznimke = IIf(DCount("*", "SecOperGrupe_kontrole", "FrmIme='DGL' AND CtrlIme='IDStatus' AND SifDV='" & Me.IzSifDV & "' AND SifGrupe='" & gsifgrupe & "'") > 0, True, False)
          'SELECT top 1 1 From secopergrupe_kontrole WHERE FrmIme='DGL' AND CtrlIme='IDStatus' AND SifDV='OTPNN' AND SifGrupe='90'
        
          If ProvjeraDatumZakZat = "" Or ProvjeriIznimke = True Then
            'CurrentProject.Connection.Execute IIf(grKO!History = True, " INSERT INTO History (FrmIme, CtrlIme, IDSif, OldVal, NewVal, Vrijeme, KorIme, Akcija) SELECT 'DGLKopiranje', 'IDStatus', CAST(" & Me.IzBrojDokumenta & " AS nvarchar(20)), IDStatus, '" & StatusIzvDokID & "', GETDATE(), '" & IIf(gKorIme = "", InitSystemUser, gKorIme) & "','U' FROM DGL WHERE DGLID = " & Me.IzBrojDokumenta, "")
            If grKO!History = True Then
                CurrentProject.Connection.Execute "INSERT INTO History (FrmIme, CtrlIme, IDSif, OldVal, NewVal, Vrijeme, KorIme, Akcija) SELECT 'DGLKopiranje', 'IDStatus', CAST(" & Me.IzBrojDokumenta & " AS nvarchar(20)), IDStatus, '" & StatusIzvDokID & "', GETDATE(), '" & IIf(gKorIme = "", InitSystemUser, gKorIme) & "','U' FROM DGL WHERE DGLID = " & Me.IzBrojDokumenta
            End If
            CurrentProject.Connection.Execute " UPDATE DGL SET IDStatus = " & StatusIzvDokID & _
                                              IIf(DLookup("ZakljucajDGL", "DGLStatusi", "ID=" & StatusIzvDokID) = True, ", Knjizeno = 1", "") & _
                                              " WHERE DGLID = " & Me.IzBrojDokumenta
          End If
          CurrentProject.Connection.Execute "dbo.spCRM_AzurirajCUpit " & Me.IzBrojDokumenta & ", " & StatusIzvDokID
        End If
      
      'kopiranje dospijeća
      Dim NeKopirajPoljeDGLDospDGLIDavans  As Boolean
      NeKopirajPoljeDGLDospDGLIDavans = DLookup("NeKopirajPoljeDGLDospDGLIDavans", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      KopiDosp = DLookup("KopiDosp", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      If IzvorniJeZbirni = False And KopiDosp > 0 And Me.SifVal = Me.IzBrojDokumenta.Column(IZBD_SifVal) Then 'kopira se samo ako su valute dokumenata iste i ako odredišni dokument još nema zapisa u DGLDosp
        CurrentProject.Connection.Execute " INSERT INTO DGLDosp (DGLID, DatDosp, Iznos, Napomena, Retencija, OpisGKS, DGLIDavans) " & _
                                          " SELECT " & DokID & ", " & IIf(KopiDosp = 1, " DatDosp ", " DATEADD(d, " & dateDiff("d", Me.IzBrojDokumenta.Column(IZBD_DatumDokumenta), Me.DatumDokumenta) & ", DatDosp ) ") & ", Iznos, Napomena, Retencija, OpisGKS," & _
                                          IIf(NeKopirajPoljeDGLDospDGLIDavans = False, "DGLIDavans", "NULL") & _
                                          " FROM DGLDosp " & _
                                          " WHERE DGLID = " & Me.IzBrojDokumenta & " AND NOT EXISTS (SELECT DGLID FROM DGLDosp WHERE DGLID = " & DokID & ")"
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "kopiranje raspodjele"
      'kopiranje raspodjele
      KopiDGLRaspPoMjTr = Nz(DLookup("KopiDGLRaspPoMjTr", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
      If IzvorniJeZbirni = False And KopiDGLRaspPoMjTr = True And Me.SifVal = Me.IzBrojDokumenta.Column(IZBD_SifVal) Then 'kopira se samo ako su valute dokumenata iste i ako odredišni dokument još nema zapisa u DGLRaspPoMjTr
        CurrentProject.Connection.Execute " INSERT INTO DGLRaspPoMjTr (DGLID, SifMjTr, Udio, Napomena, Iznos, SifPred, KontoRasp, WBSID, SifVrstePosla, SifOsobe, SifArt, SifVrOp, SifKoloneKnjige, KontoDob, IznosPDV) " & _
                                          " SELECT " & DokID & ", SifMjTr, Udio, Napomena, Iznos, SifPred, KontoRasp, WBSID, SifVrstePosla, SifOsobe, SifArt, SifVrOp, SifKoloneKnjige, KontoDob, IznosPDV" & _
                                          " FROM DGLRaspPoMjTr " & _
                                          " WHERE DGLID = " & Me.IzBrojDokumenta & " AND NOT EXISTS (SELECT DGLID FROM DGLRaspPoMjTr WHERE DGLID = " & DokID & ")"
      End If
      
       mDB_Util.LogB "DGLKopi_Click", "kopiranje Nominiranih podizvoditeljskih računa"
      'kopiranje Nominiranih podizvoditeljskih računa
      KopiDGLNomPod = Nz(DLookup("KopiDGLNomPod", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
      If IzvorniJeZbirni = False And KopiDGLNomPod = True And Me.SifVal = Me.IzBrojDokumenta.Column(IZBD_SifVal) Then 'kopira se samo ako su valute dokumenata iste i ako odredišni dokument još nema zapisa u DGLNomPod
        CurrentProject.Connection.Execute " INSERT INTO DGLNomPod (DGLID, GKSID, Iznos, Napomena, DGLIDRac, DatDosp, Retencija, IDUgovorneStavke) " & _
                                          "   SELECT " & DokID & ", GKSID, Iznos, Napomena, DGLIDRac, DatDosp, Retencija, IDUgovorneStavke " & _
                                          "   FROM DGLNomPod " & _
                                          "   WHERE DGLID = " & Me.IzBrojDokumenta & " AND NOT EXISTS (SELECT DGLID FROM DGLNomPod WHERE DGLID = " & DokID & ");" & _
                                          " INSERT INTO DGLNomPodKorisnik (DGLID, SifPartnera, Iznos, Napomena, DatDosp, Retencija, IDUgovorneStavke) " & _
                                          "   SELECT " & DokID & ", SifPartnera, Iznos, Napomena, DatDosp, Retencija, IDUgovorneStavke " & _
                                          "   FROM DGLNomPodKorisnik " & _
                                          "   WHERE DGLID = " & Me.IzBrojDokumenta & " AND NOT EXISTS (SELECT DGLID FROM DGLNomPodKorisnik WHERE DGLID = " & DokID & ")"
      End If
    
      If KopiDGLNomPod = False Then
        Dim poljeNomPod As String
        poljeNomPod = oonz(DLookup("FieldName", "DVPoljaST", "NomPod = 1 AND SifDV ='" & Me.USifDV & "'"), "")
        If poljeNomPod <> "" Then CurrentProject.Connection.Execute "UPDATE DST SET " & poljeNomPod & " = 0 WHERE DGLID = " & DokID
      End If
    
    
      'hz 29.11.2016 - naknadni update
      Dim NeKopirajDSTFiksnaPolja As String, sNeKopirajDSTFiksnaPolja As String, VrijednostPolja As String
      NeKopirajDSTFiksnaPolja = oonz(DLookup("NeKopirajDSTFiksnaPolja", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      sNeKopirajDSTFiksnaPolja = ""
      If NeKopirajDSTFiksnaPolja <> "" Then
        Dim sPoljeNeKopirajDST As Variant
        For Each sPoljeNeKopirajDST In Split(NeKopirajDSTFiksnaPolja, ",")
          If Trim(sPoljeNeKopirajDST) = "SifSer" Then
            VrijednostPolja = "'#'"
          ElseIf InStr(Trim(sPoljeNeKopirajDST), "Posto") = True Then
            VrijednostPolja = "0"
          Else
            VrijednostPolja = "NULL"
          End If
          'sNeKopirajDSTFiksnaPolja = sNeKopirajDSTFiksnaPolja + "'" & Trim(sPoljeNeKopirajDST) + "',"
          CurrentProject.Connection.Execute "UPDATE DST SET " & sPoljeNeKopirajDST & " = " & VrijednostPolja & " WHERE DGLID = " & DokID
        Next sPoljeNeKopirajDST
      End If
      
      
      Dim KopirajDSTKarakt As Boolean
      KopirajDSTKarakt = oonz(DLookup("KopirajDSTKarakt", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      'kopiraj DSTKarakt
      If KopirajDSTKarakt Then
        CurrentProject.Connection.Execute "  INSERT INTO [dbo].[DSTKarakt]([IDK], [DSTID], [VrijIzArt], [VrijUpisna], [Napomena], [Sifart], [SifSer], [KontrolaSifOsobe], [KontrolaDGLID], [KontrolaDatum])" & _
                                          "  SELECT DK.IDK, DST.DSTID, DK.VrijIzArt, DK.VrijUpisna , DK.Napomena, DK.Sifart, DK.SifSer, DK.KontrolaSifOsobe, DK.KontrolaDGLID, DK.KontrolaDatum " & _
                                          "  FROM dbo.DST " & _
                                          "  INNER JOIN DST DSTIz ON DST.KopiranIzDSTID = DSTIz.DSTID " & _
                                          "  INNER JOIN dbo.DSTKarakt DK ON DK.DSTID = DSTIz.DSTID " & _
                                          "  WHERE DST.DGLID = " & DokID
      End If
    
    Predmet:
      ' Pred:
      If NoviPredmet Then
        If DLookup("SifPred", "Pred", "SifPred='" & Me.PredL & "'") = Me.PredL Or DLookup("SifPred", "Pred", "SifPred='" & Me.PredD & "'") = Me.PredD Then
            ooMsgbox "Predmet s odabranom šifrom već postoji u bazi!", vbExclamation
            GoTo Greska
        End If
      End If
      
      Dim VodiPredmetSifOsobe As String
      VodiPredmetSifOsobe = Nz(DLookup("VodiPredmetSifOsobe", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
      
      'ako ne postoje predmet(i) dodaj ih u tablicu Pred
      If Not IsNull(Me.PredL) And IsNull(DLookup("SifPred", "Pred", "SifPred='" & Me.PredL & "'")) Then
        CurrentProject.Connection.Execute "INSERT INTO Pred(SifPred,DatumPred,SifPredVrste,VodiPredmetSifOsobe,SifPartnera) VALUES ('" & _
                Me.PredL & "'," & sqldate(Date) & ", " & IIf(PredVrstaL <> "", "'" & PredVrstaL & "'", "NULL") & ", " & IIf(VodiPredmetSifOsobe <> "", "'" & VodiPredmetSifOsobe & "'", "NULL") & ", " & IIf(Nz(Me.SifPartnera, "") <> "", "'" & Me.SifPartnera & "'", "NULL") & ")"
      End If
      
      If Not IsNull(Me.PredD) And IsNull(DLookup("SifPred", "Pred", "SifPred='" & Me.PredD & "'")) And Me.PredL <> Me.PredD Then
        CurrentProject.Connection.Execute "INSERT INTO Pred(SifPred,DatumPred,SifPredVrste,VodiPredmetSifOsobe,SifPartnera) VALUES ('" & _
                Me.PredD & "'," & sqldate(Date) & ", " & IIf(PredVrstaD <> "", "'" & PredVrstaD & "'", "NULL") & ", " & IIf(VodiPredmetSifOsobe <> "", "'" & VodiPredmetSifOsobe & "'", "NULL") & ", " & IIf(Nz(Me.SifPartnera, "") <> "", "'" & Me.SifPartnera & "'", "NULL") & ")"
      End If
    
      'update SifPred u izv. i odr. dokumentu
      
      If IzvorniJeZbirni = False Then 'za zbirne ne upisuj predmet u izvorne
        If ProvjeraDatumZakZat = "" And oonz(Me.PredL, "") <> "" Then
            If oonz(Me.PredL, "") <> oonz(DLookup("SifPred", "DGL", "DGLID = " & Me.IzBrojDokumenta), "") Then
                CurrentProject.Connection.Execute " UPDATE DGL SET SifPred=" & IIf(IsNull(Me.PredL), "Null", "'" & Me.PredL & "'") & _
                                                                            " WHERE DGLID=" & Me.IzBrojDokumenta
            End If
        End If
      End If
      CurrentProject.Connection.Execute " UPDATE DGL SET SifPred=" & IIf(IsNull(Me.PredD), "Null", "'" & Me.PredD & "'") & _
                        " WHERE DGLID=" & DokID
        
      
      If ZakljucajIzvDok = True Then
        If ProvjeraDatumZakZat = "" Then CurrentProject.Connection.Execute "UPDATE DGL SET Knjizeno=1 WHERE Knjizeno=0 AND DGLID=" & Me.IzBrojDokumenta
      End If
      
    
      'CommitTrans
      MNorm
      InitBrDok
      
      If Not (af Is Nothing) Then
        
         
        'hz dodao 15.02.2010, jer su se u Rascu žalili da im javlja Write conflict kad se vrate na izvorni dokument (ako se odabere novi predmet za izvorni dokument ili ako se programski postavi DGL.Oznacen na 1)
        
        If af.Name = "DGL" Then
          
            'pk dodao 23.08.2018    - iz Skladišne logistike su se žalili na grešku koja se pojavljivala:
            '                         u slučaju da je filtriran dokument po statusu, koji se uslijed kopiranja promijeni izvorni dokument više nije moguće dohvatiti te se javlja poruka o grešci
            '                       - za takav slučaj napravljena je izmjena da se makne filter
            If oonz(DLookup("IdStatus", "DGL", "DGLID=" & af.DGLID), "") <> StariStatus And af.FilterOn = True Then
                af.FilterOn = False
            End If
          
          
          If Nz(Me.PredL, "") <> Nz(af!SifPred, "") Or SetOznacenuIzvornom = True Or ZakljucajIzvDok = True Or StatusIzvDokID <> 0 Then
            For i = 0 To Forms.Count - 1
              If Forms(i).hwnd = af.hwnd Then
                
    
                'hz 20161117 iskomentirao SendMessage zbog greške u KET-u, ne pomaže ni adAffectCurrent, onda ovako kako je u PregledGlava
                Forms(i).Requery
                With Forms(i).RecordsetClone
                  .Find "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID)
                  If Not .EOF Then
                    Forms(i).bookmark = .bookmark
                    'Call SetForegroundWindow(f.hWnd)
                    'Forms(i).SetFocus
                  End If
                End With
    
                Exit For
              End If
            Next i
          End If
        End If
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "spDST_PovuciDefaulte"
      'ako je u DGLKopiranjeDozvole -> PovuciDefaulte = 1 tada se u stavke dokumenta povlače defaulti iz artikla
      If PovuciDefaulte Then
        CurrentProject.Connection.Execute "EXEC spDST_PovuciDefaulte " & DokID & ", NULL, NULL, '" & PovuciDefaulteZa & "'"
      End If
      
      'provjeri otvorenost dokumenta (i ispiši što je ostalo otvoreno (ako je ostalo))
      Dim rOtv As Recordset, so As String
      If ProvjeriOtvorenost = True Then
        Set rOtv = New Recordset
        rOtv.Open " SELECT DST.SifArt, Artikli.NazArt, f.Kol " & _
                  " FROM DGL INNER JOIN DST ON DGL.DGLID = DST.DGLID " & _
                  " INNER JOIN dbo.fnNarFifo (1, " & Me.IzBrojDokumenta & ", NULL, NULL, NULL) f ON DST.DSTID = COALESCE(f.oDSTID, f.zDSTID) AND DGL.DGLID = f.oDGLID " & _
                  " INNER JOIN Artikli ON DST.SifArt = Artikli.SifArt " & _
                  " WHERE DGL.DGLID = " & Me.IzBrojDokumenta, CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
        If rOtv.RecordCount <> 0 Then
          so = "PREOSTALO OTVORENO NA DOKUMENTU " & Me.IzSifDV & " - " & Me.IzBrojDokumenta.Column(1) & vbCrLf & vbCrLf
          While Not rOtv.EOF
            so = so & rOtv!SifArt & "-" & Left(rOtv!NazArt, 30) & " - " & rOtv!Kol & vbCrLf
            rOtv.MoveNext
          Wend
          ooMsgbox so, vbInformation + vbOKOnly
        End If
        rOtv.Close
        Set rOtv = Nothing
        
      End If
      
      'provjeri da li je odredišni ulazna narudžba i da li na njoj ima artikala kojima je Artikli.NeNarucuj = True
      Dim rNeNar As Recordset, sNeNar As String
      If DCount("*", "DV", "SifDV='" & Me.USifDV & "' AND Nar <> 0 AND UI = 3 AND Rez = 1") > 0 Then 'dokument je ulazna narudžba
        Set rNeNar = New Recordset
        rNeNar.Open " SELECT DISTINCT DST.SifArt, Artikli.NazArt " & _
                  " FROM DST INNER JOIN Artikli ON DST.SifArt = Artikli.SifArt " & _
                  " WHERE Artikli.NeNarucuj = 1 AND DST.DGLID = " & DokID & _
                  " ORDER BY DST.SifArt ", CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
        If rNeNar.RecordCount <> 0 Then
          sNeNar = "PAŽNJA: NA ODREDIŠNOM DOKUMENTU POSTOJE ARTIKLI KOJI SU OZNAČENI KAO 'NE NARUČUJ'!" & vbCrLf & vbCrLf
          While Not rNeNar.EOF
            sNeNar = sNeNar & rNeNar!SifArt & "-" & Left(rNeNar!NazArt, 30) & vbCrLf
            rNeNar.MoveNext
          Wend
          ooMsgbox sNeNar, vbInformation + vbOKOnly
        End If
        rNeNar.Close
        Set rNeNar = Nothing
      End If
      
      'kopiraj i DGL2
      If IsNumeric(Me.IzBrojDokumenta) And IsNumeric(DokID) And Not ooisnull(DLookup("ParentDGLID", "DGL2", "ParentDGLID = " & Me.IzBrojDokumenta)) Then
        CurrentProject.Connection.Execute " INSERT INTO DGL2 (ParentDGLID, Pakiranje, Prijevoznik, RegistracijaVozila, Vozac, BrojIdentDokumenta, NetoMasa, BrutoMasa, Dimenzije,SifPartneraUgovPrijevoznik)" & _
                                          " SELECT " & DokID & ", Pakiranje, Prijevoznik, RegistracijaVozila, Vozac, BrojIdentDokumenta, NetoMasa," & _
                                          " BrutoMasa, Dimenzije ,SifPartneraUgovPrijevoznik FROM DGL2 WHERE DGL2.ParentDGLID = " & Me.IzBrojDokumenta & " AND " & DokID & " NOT IN (SELECT DGL2.ParentDGLID FROM DGL2)"
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "KopirajPoveznice"
      'KopirajPoveznice
      If KopirajPoveznicu = True Then
        Dim IDPoveznice As Variant, sSQL As String
        
        IDPoveznice = oonz(DLookup("PGLID", "PovezniceSt", "DGLID = " & Me.IzBrojDokumenta), "")
        If Not ooisnull(IDPoveznice) Then
            sSQL = "IF NOT EXISTS (SELECT * FROM PovezniceST WHERE DGLID = " & DokID & ") BEGIN INSERT INTO PovezniceST(PGLID, DGLID) VALUES (" & IDPoveznice & ", " & DokID & ") END"
            CurrentProject.Connection.Execute sSQL
            
            If NazoviPoveznicuPremaOdredisnom = True Then
                Dim BrojDokumenta As String, VrstaDokumenta As String
                
                BrojDokumenta = DLookup("BrojDokumenta", "DGL", "DGLID = " & DokID)
                VrstaDokumenta = DLookup("SifDV", "DGL", "DGLID = " & DokID)
                sSQL = "UPDATE PovezniceGL SET Naziv = '" & VrstaDokumenta & "-" & BrojDokumenta & "' WHERE PGLID = " & IDPoveznice
                CurrentProject.Connection.Execute sSQL
            End If
        End If
      Else 'ako je DGLKopiranjeDozvole.KopirajPoveznicu = 0, a DV.GenerirajPoveznicuKodSpremanja = 1 generiraj poveznicu - IL 20200625
        Call GenerirajPoveznicu(DokID)
      End If
      
      
      
      If KopirajDSTSerBr = True Then
                                               
                CurrentProject.Connection.Execute "INSERT INTO DstSerBr (DSTID,SerBr,PC,SN,LOT,EXP,JiSifStatusa,JiSifStatusaZatrazen,JiShema) " & _
                                        "SELECT D.DSTID,DS.SerBr,DS.PC,DS.SN,DS.LOT,DS.EXP,DS.JiSifStatusa,DS.JiSifStatusaZatrazen,DS.JiShema FROM DST D " & _
                                        "INNER JOIN DstSerBr DS ON DS.DSTID = D.KopiranIzDSTID " & _
                                        "WHERE D.DGLID = " & DokID
      End If
      
      
      mDB_Util.LogB "DGLKopi_Click", "fiskalizacija za KET"
      '"fiskalizacija" za KET
      If FiskalizacijaZaKET = True Then
        'računaj PNBO
        Dim PNBO As String
        PNBO = KetGenPNBO(DokID)
        
        CurrentProject.Connection.Execute " UPDATE DGL SET PozivNaBroj = '" & PNBO & "' WHERE PozivNaBroj IS NULL AND DGLID = " & DokID
        
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "DatIsteka u odredišne stavke"
      'upiši DatIsteka u odredišne stavke
      'dodano za RotoBakro
      If Me.cboNar = cboNAR_SVEISP Then
        CurrentProject.Connection.Execute "  UPDATE DST " & _
                                          "  SET DSTDatum = DatIstekaSer.DatIsteka " & _
                                          "  FROM DST " & _
                                          "  INNER JOIN (SELECT D2.SifSer, MAX(D2.DSTDatum) AS DatIsteka " & _
                                          "              FROM DST D2 " & _
                                          "              WHERE D2.SifSer <> '#' AND D2.DSTDatum IS NOT NULL " & _
                                          "              GROUP BY D2.SifSer " & _
                                          "              ) DatIstekaSer ON DST.SifSer = DatIstekaSer.SifSer " & _
                                          "  WHERE DST.DSTDatum IS NULL AND DGLID = " & DokID
      End If
      
    
      Call ProvjeriPostavkuZaObrRaz(DokID) 'hz prebacio u poseban Sub 20200806
    
      
      mDB_Util.LogB "DGLKopi_Click", "proknjiži odredišni dokument"
      'proknjiži odredišni dokument
      If ProknjiziOdredisni = True Then
        Call PrenesiDGLIDUFin(DokID)
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "ZakljucajOdrDok"
      If ZakljucajOdrDok = True Then
        CurrentProject.Connection.Execute "UPDATE DGL SET Knjizeno=1 WHERE Knjizeno=0 AND DGLID=" & DokID
      End If
      
      mDB_Util.LogB "DGLKopi_Click", "ProvjereKodSpremanjaZapisa"
      If DCount("TblIme", "ProvjereKodSpremanjaZapisa", "TblIme='DGL'") > 0 Then
        Call hzFis.ProvjeriKodSpremanja("DGL", CStr(DokID))
      End If
      
      '20190924
      If IzvrsiSQL <> "" Then Call hzFis.Kopiranje_IzvrsiSQL(IzvrsiSQL, Me.IzBrojDokumenta, DokID, "")
      
      SecondsElapsed = Round(Timer - StartTime, 2)
      mDB_Util.LogB "DGLKopi_Click", "Duration s: " & SecondsElapsed
      mDB_Util.LogB "DGLKopi_Click", "END"
      
      If PozivSaSemafora = False Then
        If EditModeKopiranogDok = True Then
          GoToDok DokID, "DGLID", False, True
          DoCmd.Close acForm, Me.Name, acSaveNo
          Exit Sub
        ElseIf BezPorukeZaOtvaranjeDok = True Then
          GoToDok DokID, "DGLID", False
          DoCmd.Close acForm, Me.Name, acSaveNo
          Exit Sub
        Else
          If MyMsgBox(266, vbYesNo + vbQuestion) = vbYes Then
            GoToDok DokID, "DGLID", False
            DoCmd.Close acForm, Me.Name, acSaveNo
            Exit Sub
            'DoCmd.OpenForm "DGL", , , , , , UBDC_DGLID
          Else
            If FiskalizacijaZaKET = True Then DoCmd.Close acForm, Me.Name, acSaveNo: Exit Sub
          End If
        End If
      Else
        DoCmd.Close acForm, Me.Name, acSaveNo
        Exit Sub
      End If
      
      Me.SetFocus
      
      Me.USifDV = Null
      Me.UBrojDokumenta = Null
      Me.UBrojDokumentaC = Null
      Me.UBrojDokumentaC.RowSource = ""
      Me.PredD = Null
      PredVrstaD = ""
      'Pred: na kraju kopiranja osvježi liste predmeta
      Me.ListPredmetiIz.RowSource = "SELECT DGLID, SifDV, BrojDokumenta, PodPred FROM DGL" & _
                " WHERE SifPred='" & Nz(Me.PredL, "") & "'" & _
                " ORDER BY SifDV, BrojDokumenta"
      
      Me.ListPredmetiU.Requery
      
      If Me.FrameUDok.Value = UDOK_REV Then Me.URevBr = oonz(DMax("Rev", "DGL", "SifDV = '" & Me.IzSifDV.Column(IZSDV_SifDV) & "' AND BrojDokumenta = '" & Me.IzBrojDokumenta.Column(IZBD_BrojDokumenta) & "'"), 0) + 1
      
      Exit Sub
    Greska:
      'Rollback
      MNorm
      mDB_Util.LogB "DGLKopi_Click", "Greška: " & err.Description
      ooMsgbox "Greška kod kopiranja dokumenta!" & vbCr & err.Description, vbCritical
      SecondsElapsed = Round(Timer - StartTime, 2)
      mDB_Util.LogB "DGLKopi_Click", "Duration s: " & SecondsElapsed
    End Sub
    
    
    Sub ProvjeriTecaj() 'hz prebacio u posebnu funkciju, procedure too large
      Dim t As String
      
      'provjeri tečaj
      If Me.FrameUDok = UDOK_NOVI Or Me.FrameUDok = UDOK_REV Then
        If IsNull(DLookup("Tcj", "TL", "DatumTecaja=" & sqldate(Me.DatumDokumenta) & " AND SifVal='" & Me.SifVal & "'")) Then
          'tečaj nije upisan; ako je domaći, upiši 1
          If Me.SifVal = rSifVal Then
            t = "1"
            CurrentProject.Connection.Execute "INSERT INTO TL(SifVal,DatumTecaja,Tcj) VALUES ('" & Me.SifVal & "'," & _
                                            sqldate(Me.DatumDokumenta) & "," & Translate(Format(t, "0.000000"), Format(0, "."), ".") & ")"
          Else 'pitaj za tečaj valute
            If SinkStart(Me.DatumDokumenta, False, Me.DatumDokumenta, Me.SifVal) = False Then
              Do While True
                If grKO!ZaNepoznatiTcjUpisi0 = True Then
                  t = 0
                Else
                  t = ooInputBox("Upišite tečaj " & Me.SifVal & " za " & Format(Me.DatumDokumenta, "dd.mm.yyyy") & ":", "Unos tečaja", 1)
                End If
                If t = "" Then Exit Sub
                If Not IsNumeric(t) Or t < 0 Then
                  ooMsgbox "Neispravan tečaj!", vbExclamation
                Else
                  Exit Do
                End If
              Loop
              Dim PrepisiTCJuTcjZaDST As Boolean
              PrepisiTCJuTcjZaDST = DLookup("SinkTcjZaDST", "Korisnik2")
              
              CurrentProject.Connection.Execute "INSERT INTO TL(SifVal,DatumTecaja,Tcj, TcjZaDST) VALUES ('" & Me.SifVal & "'," & _
                                            sqldate(Me.DatumDokumenta) & _
                                            "," & Translate(Format(t, "0.000000"), Format(0, "."), ".") & _
                                            "," & IIf(PrepisiTCJuTcjZaDST = True, Translate(Format(t, "0.000000"), Format(0, "."), "."), "Null") & _
                                            ")"
            End If
          End If
        End If
      End If
        
    End Sub
    
    
    Sub ProvjeriPostavkuZaObrRaz(DokID As Long)
    
        'hz prebacio iz ButKopiranje_Click - 20200806 - bila je procedure too large
    
        ' =============================================================================
        ' bj@27.9.2019. - provjera za postavku oko automatskog generiranja podataka za
        '                 obračunsko razdoblje računa - treba za e-Račune
        ' =============================================================================
    
        Dim SifIzgl As String
        Dim ImaDatumIsporuke As Boolean
        SifIzgl = oonz(DLookup("SifIzgledaDGL", "DV", "SifDV = '" & Me.USifDV & "'"), "")
        ImaDatumIsporuke = False
    
        If DLookup("CtrlName", "DVPoljaDGL", "SifIzgledaDGL = '" & SifIzgl & "' And CtrlName = 'DatumIsporuke'") <> "" Then
            ImaDatumIsporuke = True
        End If
    
        If DLookup("CtrlName", "DVPoljaDGL", "SifIzgledaDGL = '" & SifIzgl & "' And CtrlName = 'ObrRazdOd'") <> "" Then
            Dim ObrRazd As Integer
            Dim DatumIsp As String
            Dim DatumDok As String
            Dim ObrRazdOD As Date
            Dim ObrRazdDO As Date
    
            ObrRazd = oonz(DLookup("ERacunObrRazdoblje", "DV", "SifDV = '" & Me.USifDV & "'"), 0)
            DatumDok = oonz(DLookup("DatumDokumenta", "DGL", "DGLID = " & DokID), "")
            DatumIsp = oonz(DLookup("DatumIsporuke", "DGL", "DGLID = " & DokID), "")
    
            If ObrRazd = 1 Then ' 1. opcija: DGL.ObrRazdOd da bude 1. u mjesecu od mjeseca isporuke/dokumenta; DGL.ObrRazDo da bude datum isporuke/datumdokumenta
                If ImaDatumIsporuke = True And oonz(DatumIsp, "") <> "" Then
                    ObrRazdOD = DateSerial(Year(CDate(DatumIsp)), Month(CDate(DatumIsp)), 1)
                    ObrRazdDO = CDate(DatumIsp)
                Else
                    ObrRazdOD = DateSerial(Year(CDate(DatumDok)), Month(CDate(DatumDok)), 1)
                    ObrRazdDO = CDate(DatumDok)
                End If
                CurrentProject.Connection.Execute "UPDATE DGL SET ObrRazdOd = " & sqldate(ObrRazdOD) & ", ObrRazdDo = " & sqldate(ObrRazdDO) & " WHERE DGLID = " & DokID
            ElseIf ObrRazd = 2 Then ' 2. opcija: DGL.ObrRazdOd da bude 1. u mjesecu od mjeseca isporuke/dokumenta; DGL.ObrRazDo da zadnji dan u mjesecu od mjeseca isporuke/dokumenta
                If ImaDatumIsporuke = True And oonz(DatumIsp, "") <> "" Then
                    ObrRazdOD = DateSerial(Year(CDate(DatumIsp)), Month(CDate(DatumIsp)), 1)
                    ObrRazdDO = DateSerial(Year(CDate(DatumIsp)), Month(CDate(DatumIsp)) + 1, 0)
                Else
                    ObrRazdOD = DateSerial(Year(CDate(DatumDok)), Month(CDate(DatumDok)), 1)
                    ObrRazdDO = DateSerial(Year(CDate(DatumDok)), Month(CDate(DatumDok)) + 1, 0)
                End If
                CurrentProject.Connection.Execute "UPDATE DGL SET ObrRazdOd = " & sqldate(ObrRazdOD) & ", ObrRazdDo = " & sqldate(ObrRazdDO) & " WHERE DGLID = " & DokID
            End If
        End If
        ' =============================================================================
    End Sub
    
    'Function GetRaspisiPoPozQuery(s As String, SifSklad2Edit As String, DokID As Long, PlusUJednako As Boolean, KopiVezaSifArt As String, neKop As String, SklUvijek) As String
    '
    '    GetRaspisiPoPozQuery = ""
    '    e = " INSERT INTO DST (DGLID, S, TrosRbr, SifArt, DSTDatum, DSTNarDD, DSTBarCode, DSTKatBr, DSTSifPred, DSTSifVrOp, DSTSifVrOpRazrade, " & _
    '          " SifSer, OpisArtikla,  SifSklad, SifPoz, SifMjTr," & s & _
    '          ", DSTNarDGLID" & IIf(SifSklad2Edit <> "", ", SifSklad2", "") & ",DSTETOID, SifDSTVrste, SifDSTVrste2, ZaGKSSifArt, DSTSifOsobe, DSTEGLID, DSTObjektID, IS_SifZemljePodrijetla, SifAkcije, DSTSifPartnera, SifSkladIzvDok, KopiranIzDSTID, DSTDatum2, DSTDatum3, DSTDatum4 " & ")" & _
    '          " SELECT " & DokID & "," & IIf(Me.CboDT.enabled Or PlusUJednako = True, "1", "S") & ", DST.TrosRbr, " & _
    '          IIf(KopiVezaSifArt = True, " COALESCE(Artikli.VezaSifArt, DST.SifArt), ", " DST.SifArt,") & _
    '          IIf(hzInstr("DSTDatum", neKop) = True, "NULL", "DST.DatIsteka") & ", " & IIf(hzInstr("DSTNarDD", neKop) = True, "NULL", " DST.DSTNarDD") & ", " & _
    '          " CASE WHEN DestDV.cwDSTBarCode > 0 THEN DST.DSTBarCode ELSE Null END, " & _
    '          " CASE WHEN DestDV.cwDSTKatBr > 0 THEN DST.DSTKatBr ELSE Null END, " & _
    '          " CASE WHEN DestDV.cwDSTSifPred > 0 THEN DST.DSTSifPred ELSE Null END, DST.DSTSifVrOp, DST.DSTSifVrOpRazrade, " & _
    '          " DST.SifSer, DST.OpisArtikla,  " & IIf(SklUvijek <> "", "'" & SklUvijek & "',", skl) & " , NarJOIN.SifPoz " & mjtros & S2 & _
    '          "," & IIf(NarID <> 0 And (Me.FrameUDok.Value = 2 Or CopyNARIDUStavku = True) And DLookup("cwDSTNarDGLID", "DV", "SifDV='" & Me.USifDV & "'") > 0, NarID, "Null") & IIf(SifSklad2Edit <> "", ", '" & SifSklad2Edit & "'", "") & _
    '          ",DST.DSTETOID, DST.SifDSTVrste, DST.SifDSTVrste2, DST.ZaGKSSifArt, " & IIf(hzInstr("DSTDatum", neKop) = True, "NULL", "CASE WHEN DestDV.cwDSTSifOsobe > 0 THEN DST.DSTSifOsobe ELSE Null END") & _
    '          ", DST.DSTEGLID, DST.DSTObjektID, DST.IS_SifZemljePodrijetla, DST.SifAkcije, DST.DSTSifPartnera, DST.SifSklad, DST.DSTID, "
    '
    '
    '      e = e & " CASE WHEN DestDV.cwDSTDatum2 > 0 THEN DST.DSTDatum2 ELSE Null END, " & _
    '              " CASE WHEN DestDV.cwDSTDatum3 > 0 THEN DST.DSTDatum3 ELSE Null END, " & _
    '              " CASE WHEN DestDV.cwDSTDatum4 > 0 THEN DST.DSTDatum4 ELSE Null END "
    '
    '
    '      e = e & " FROM DST INNER JOIN Artikli ON DST.SifArt=Artikli.SifArt INNER JOIN Skladista ON DST.SifSklad = Skladista.SifSklad " & _
    '          " INNER JOIN DGL ON DGL.DGLID = DST.DGLID INNER JOIN DV ON DGL.SifDV=DV.SifDV " & _
    '          NarJOIN & _
    '          ", (SELECT cwDSTBarCode, cwDSTSifPred, cwDSTKatBr, cwSifMjTr, cwDSTSifOsobe, cwDSTDatum2, cwDSTDatum3, cwDSTDatum4 FROM DV WHERE SifDV = '" & Me.USifDV & "') DestDV " & _
    '          " WHERE DST.DGLID=" & Me.IzBrojDokumenta & _
    '          wS & _
    '          IIf(Me.FrameSkladista.Value = SKL_DOK, " AND DST.SifSklad IN (SELECT SifSklad FROM DVSkladista WHERE SifDV = '" & Me.USifDV.Column(USDV_SifDV) & "') ", "") & _
    '          IIf(KopiSamoSkl <> "", " AND DST.SifSklad='" & KopiSamoSkl & "'", "") & _
    '          IIf(Not IsNull(Me.CboKopiSamoSaSklad), " AND DST.SifSklad = '" & Me.CboKopiSamoSaSklad & "'", "") & _
    '          IIf(KopiSamoKontr <> "", " AND Artikli.Kontrola IN " & sKopiSamoKontr, "") & _
    '          IIf(NeKopiSamoSkladZaOper <> "", " AND DST.SifSklad NOT IN (" & NeKopiSamoSkladZaOper & ")", "") & _
    '          IIf(SecSkladista <> "", " AND DST.SifSklad IN (" & SecSkladista & ")", "") & _
    '        " ORDER BY DSTOrd "
    '
    'End Function
    
    'IL 20200625 - izdvajam zbog ograničenja koda
    Sub GenerirajPoveznicu(DokDGLID As Long)
        Dim GenerirajPoveznicuKodSpremanja As Boolean
        GenerirajPoveznicuKodSpremanja = Nz(DLookup("GenerirajPoveznicuKodSpremanja", "DV", "SifDV='" & Me.USifDV & "'"), False)
        If GenerirajPoveznicuKodSpremanja = True Then
            Dim BrojDokumenta As String
            BrojDokumenta = DLookup("BrojDokumenta", "DGL", "DGLID = " & DokDGLID)
            CurrentProject.Connection.Execute "INSERT INTO PovezniceGL(Naziv) VALUES('" & Me.USifDV & "-" & BrojDokumenta & "'); " & _
                "INSERT INTO PovezniceST(PGLID, DGLID) VALUES(SCOPE_IDENTITY(), " & DokDGLID & ")"
        End If
    End Sub
    
    Sub PostaviDatumZaIzvjestaje(DokDGLID As Long, DatDokumenta As Date)
        ' =====================================
        ' bj@28.5.2020.
        ' Postavljanje datuma za izvještaje
        '   11.08.2020. - više se ne koristi
        ' =====================================
        'If DCount("*", "DVPoljaDGL", "CtrlName='DatumZaIzvjestaje' AND SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & "'") > 0 Then
            Dim DatPrivZaklj As String
            Dim DatDanas As Date
            
            DatDanas = Date
            DatPrivZaklj = oonz(DLookup("DatumPrivremenogZakljucavanja", "Korisnik2", ""), "")
            
            If oonz(DatPrivZaklj, "") <> "" Then
                If DatDanas >= CDate(DatPrivZaklj) And DatDokumenta < DateSerial(Year(DatDanas), Month(DatDanas), 1) Then
                    CurrentProject.Connection.Execute "UPDATE DGL SET DatumZaIzvjestaje = " & sqldate(DatDanas) & " WHERE DGLID = " & DokDGLID
    '                If oonz(DLookup("ZakljucajDokDoKrajaPrethMjeseca", "SecOperGrupe", "SifGrupe = '" & gSifGrupe & "'"), False) = False Then
    '                End If
                Else
                    CurrentProject.Connection.Execute "UPDATE DGL SET DatumZaIzvjestaje = " & sqldate(DatDokumenta) & " WHERE DGLID = " & DokDGLID
                End If
            End If
        'End If
        ' =====================================
    End Sub
    
    Function Provjeri() As Boolean
      Provjeri = False
      'izvorišna vrsta i broj dokumenta
      If IsNull(Me.IzSifDV) Then
        ooMsgbox "Nije odabrana vrsta dokumenta iz koje se kopira dokument!", vbOKOnly + vbInformation
        Me.IzSifDV.SetFocus
        Exit Function
      End If
      If IsNull(Me.IzBrojDokumenta) Then
        ooMsgbox "Nije odabran dokument koji se kopira!", vbOKOnly + vbInformation
        Me.IzBrojDokumenta.SetFocus
        Exit Function
      End If
      
      'odredišna vrsta i dokument (postojeći DGLID ili broj novog dokumenta)
      If IsNull(Me.USifDV) Then
        ooMsgbox "Nije odabrana odredišna vrsta dokumenta !", vbOKOnly + vbInformation
        Me.USifDV.SetFocus
        Exit Function
      End If
      If Me.FrameUDok = UDOK_POSTOJECI Then
        If IsNull(Me.UBrojDokumentaC) Then
          ooMsgbox "Nije odabran odredišni broj dokumenta!", vbOKOnly + vbInformation
          Me.UBrojDokumentaC.SetFocus
          Exit Function
        End If
    
        If IsRecordLocked2("DGLID", Me.UBrojDokumentaC, False) = 2 Then
          ooMsgbox "Kopiranje nije moguće!", vbExclamation + vbOKOnly
          Exit Function
        End If
    
      Else 'Me.FrameUDok = UDOK_NOVI
        If IsNull(Me.UBrojDokumenta) Then
          ooMsgbox "Nije upisan odredišni broj dokumenta!", vbOKOnly + vbInformation
          Me.UBrojDokumenta.SetFocus
          Exit Function
        End If
      End If
      
      'odredišno mjesto troška
      If Me.FrameMjTr.Value = MJTR_KOR And IsNull(Me.SifMjTrST) Then
        ooMsgbox "Nije upisano odredišno mjesto troška!", vbOKOnly + vbInformation
        Me.SifMjTrST.SetFocus
        Exit Function
      End If
      
      'odabran je korisnički upis skladišta, a skladište nije odabrano
      If Me.FrameSkladista.Value = SKL_KOR And IsNull(Me.SifSklad) Then
        ooMsgbox "Odredišni dokument zahtijeva skladište!", vbOKOnly + vbInformation
      End If
      
      'odabran je korisnički upis skladišta, a skladište nije odabrano
      If Me.FrameSkladista2.Value = SKL_KOR And IsNull(Me.SifSklad2) Then
        ooMsgbox "Odredišni dokument zahtijeva skladište2!", vbOKOnly + vbInformation
      End If
        
      'hz iskomentirao 2.8.2013. - već duže vrijeme imamo u combo boxu s valutama na deviznom dokumentu i HRK, mislim da ovo nema potrebe; a zgodno nam je za koncept gdje su nam dokumenti takvi da su u istoj vrsti i devizni i kunski
      '3.9. opet otkomentirao i preradio da ipak pita...
      ' bj@18.10.2018. - ova provjera ide ukoliko nije isključena u dozvolama
      ' bj@19.12.2022. - gašenje kontrole prema uputi BŠ i IK
    '  If NeProvDevDokVal = False And Me.USifDv.Column(USDV_DevizniDokument) = True And Me.SifVal = rSifVal Then
    '    If ooMsgbox("Odredišni dokument je devizni, a valuta je domaća!" & vbCrLf & "Nastaviti kopiranje (naknadno u odredišnom dokumentu promijeniti valutu, ako je potrebno)?", vbYesNo + vbQuestion) = vbNo Then
    '      Me.SifVal.SetFocus
    '      Exit Function
    '    End If
    '  End If
      
      
      If Me.FrameUDok = UDOK_NOVI Then 'za postojeći dokument ne treba ispitivati partnera i pdv vrop...
        If Me.SifPartnera.enabled And IsNull(Me.SifPartnera) Then
          ooMsgbox "Nije upisan partner!", vbInformation
          Me.SifPartnera.SetFocus
          Exit Function
        End If
        
        'bj@15.4.19. - stavljena provjera samo na neupisanu vrstu oporezivanja u slučaju da je to polje omogućeno.
        If Me.SifVrOp.enabled And IsNull(Me.SifVrOp) Then
          ooMsgbox "Nije odabrana vrsta oporezivanja!", vbInformation
          Me.SifVrOp.SetFocus
          Exit Function
        End If
        
    '    If Me.SifVrOp.enabled And IsNull(Me.SifPDVKnjige) And IsNull(Me.SifVrOp) Then
    '      ooMsgbox "Nije odabrana vrsta oporezivanja!", vbInformation
    '      Me.SifVrOp.SetFocus
    '      Exit Function
    '    End If
      End If
      
      If Not (Me.DatumDokumenta >= gObrRazdOD And Me.DatumDokumenta <= gObrRazdDO) Then
        ooMsgbox "Odabrani datum nije iz odabranog perioda upisa!" & vbCrLf & _
               "Kopiranje nije moguće!", vbExclamation
        Exit Function
      End If
      
      'zatvorena razdoblja
      If Nz((CVDate(DMax("DatumObrRaz", "ObracunskaRazdoblja")) > CVDate(Me.DatumDokumenta)), False) = True And Not (KetFisk = True) Then
        ooMsgbox "Odabrani datum je iz zatvorenog obračunskog razdoblja!" & vbCrLf & _
               "Kopiranje nije moguće!", vbExclamation
        Exit Function
      End If
      
      'provjera PartneriDrzaveDozvole
      If DLookup("KontrolaPartneriDrzaveZabrana", "DV", "SifDV = '" & Me.USifDV & "'") = True Then
        Dim R As Recordset, s As String
        Set R = New Recordset
        s = " SELECT Artikli.SifArt AS [Šifra artikla] " & _
            " FROM Artikli INNER JOIN PartneriDrzaveZabrane PDZ ON Artikli.SifPartnera = PDZ.SifPartnera " & _
            " INNER JOIN Mjesta ON PDZ.SifDrzave = Mjesta.SifDrzave " & _
            " INNER JOIN Partneri ON Mjesta.SifMjesta = Partneri.SifMjesta " & _
            " WHERE PDZ.Aktivno = 1 AND Artikli.SifArt IN (SELECT SifArt FROM DST WHERE DGLID = " & Me.IzBrojDokumenta & ") AND Partneri.SifPartnera = '" & Me.SifPartnera & "' "
        R.Open s, CurrentProject.Connection, adOpenForwardOnly, adLockReadOnly
        If R.RecordCount <> 0 Then
          ooMsgbox "Odredišni dokument zahtijeva kontrolu dozvoljenih isporuka artikala za odabranog partnera (zabrana vezana uz proizvođača artikla i državu)!" & vbCrLf & _
                   "Kopiranje nije moguće!" & vbCrLf & vbCrLf & _
                   "(slijedi lista nedozvoljenih artikala)", vbExclamation
                     
          rptlistprepare s, "Lista nedozvoljenih artikala", True
          rptlistshow False
                     
          R.Close
          Set R = Nothing
          Exit Function
        End If
        R.Close
        Set R = Nothing
        
      End If
      
      Provjeri = True
    End Function
      
      
    Private Sub ButNoviPred_Click()
      Dim NoviPred As String
        
      'kad je zadnji char u SifPred ",", isnumeric vrati true, ali ga ne može konvertirati u int, pa je zato ovaj right(rtrim... 27.08.2002 hz
      'isnumeric(20.09 ili 20,09) vrati kao true ali ne može castat kao int. Ubačen filter "Sifpred NOT LIKE '%.%' AND SifPred NOT LIKE '%,%'"
      Dim DefSifPredVrste As String
      DefSifPredVrste = Nz(DLookup("DefSifPredVrste", "DV", "SifDV = '" & Me.IzSifDV & "'"), "")
      
      If DefSifPredVrste <> "" Then
        NoviPred = DLookup("dbo.[fn_GetNoviSifPred]('" & DefSifPredVrste & "', " & DLookup("Godina", "DGL", "DGLID = " & Me.IzBrojDokumenta) & ", 0, '" & DLookup("SifMjTr", "DGL", "DGLID = " & Me.IzBrojDokumenta) & "')", "Korisnik")
        PredVrstaL = DefSifPredVrste
        PredVrstaD = DefSifPredVrste
      Else
        NoviPred = Nz(DMax("CASE WHEN IsNumeric(SifPred)=1 THEN CASE WHEN Right(Rtrim(SifPred),1)=',' THEN 0 ELSE SifPred END ELSE 0 END", "Pred", "Sifpred NOT LIKE '%.%' AND YEAR(DatumPred) = YEAR(GETDATE()) AND SifPred NOT LIKE '%,%'"), 0) + 1
      End If
      
      NoviPredmet = True
      
      If Not IsNull(Me.PredL) And Me.PredL <> NoviPred And Me.PredL <> "" Then
        If ooMsgbox("Izvorni dokument pripada predmetu " & Me.PredL & "!" & vbCr & "Želite li taj dokument pridružiti novom predmetu?" & vbCr & vbCr & _
                  "PAŽNJA: Izvorni dokument bit će obrisan iz starog predmeta.", vbYesNo + vbQuestion) = vbYes Then
                    Me.PredL = NoviPred
        Else
            NoviPredmet = False
            PredVrstaL = ""
        End If
      Else
        Me.PredL = NoviPred
      End If
      
      If Not IsNull(Me.PredD) And Me.PredD <> NoviPred Then
        If ooMsgbox("Odredišni dokument pripada predmetu " & Me.PredD & "!" & vbCr & "Želite li taj dokument pridružiti novom predmetu?" & vbCr & vbCr & _
                  "PAŽNJA: Odredišni dokument bit će obrisan iz starog predmeta.", vbYesNo + vbQuestion) = vbYes Then
                    Me.PredD = NoviPred
        Else
            NoviPredmet = False
            PredVrstaD = ""
        End If
      Else
        Me.PredD = NoviPred
      End If
      
    End Sub
    
    Private Sub ButPrikaziDijagram_Click()
      Dim URL As String, URLsub As String, Vrsta As String
      URL = "http://yuml.me/diagram/class/" '& "</strong>"
      'Vrsta = ooInputBox(TransRpt("Prikaz vrsta dokumenata (kod velikog broja vrsta odabrati samo šifru DV): " & vbCrLf & vbCrLf & "1. Naziv + šifra DV" & vbCrLf & "2. Šifra DV"), , "1")
      Vrsta = ooInputBox_Options("Prikaz vrsta dokumenata (kod velikog broja vrsta odabrati samo šifru DV):", , "1", , , , , _
            "1. Naziv + šifra DV", _
            "2. Šifra DV")
      If Vrsta = "1" Then URLsub = "<strong>" & oonz(DLookup("dbo.fn_SastaviDijagramUML(1)", "Korisnik"), "") & "</strong>"
      If Vrsta = "2" Then URLsub = "<strong>" & oonz(DLookup("dbo.fn_SastaviDijagramUML(11)", "Korisnik"), "") & "</strong>"
      If Vrsta <> "1" And Vrsta <> "2" Then
        ooMsgbox "Pogrešan odabir!", vbExclamation
        Exit Sub
      End If
      On Error Resume Next
      
      Call fHandleFile(URL & URLsub, WIN_NORMAL)
      
      If err Then
        ooMsgbox "Greška: " & err.Description, vbExclamation
      End If
      On Error GoTo 0
    End Sub
    
    Private Sub ButVratiStarePred_Click()
      
      If Not IsNull(Me.IzBrojDokumenta.Column(IZBD_SifPred)) And Me.PredL <> Me.IzBrojDokumenta.Column(IZBD_SifPred) And Me.PredL <> "" Then
        If ooMsgbox("Želite li vratiti stari predmet izvornog dokumenta?", vbYesNo + vbQuestion) = vbYes Then
            NoviPredmet = False
            Me.PredL = IIf(Me.IzBrojDokumenta.Column(IZBD_SifPred) <> "", Me.IzBrojDokumenta.Column(IZBD_SifPred), Null)
            PredVrstaL = ""
        End If
      End If
    
      If Not IsNull(Me.UBrojDokumentaC.Column(UBDC_SifPred)) And Me.PredD <> Me.UBrojDokumentaC.Column(UBDC_SifPred) And Me.PredD <> "" Then
        If ooMsgbox("Želite li vratiti stari predmet odredišnog dokumenta?", vbYesNo + vbQuestion) = vbYes Then
            NoviPredmet = False
            Me.PredD = IIf(Me.UBrojDokumentaC.Column(UBDC_SifPred) <> "", Me.UBrojDokumentaC.Column(UBDC_SifPred), Null)
            PredVrstaD = ""
        End If
      End If
    End Sub
    
    Private Sub cboCijena_AfterUpdate()
      If SVAMGetSetting("Dok", "DGLKopiranje", "0") = 0 Then
        SVAMSaveSetting "Dok", "CijenaDGLKopiranje", Me.cboCijena
      End If
    End Sub
    
    
    Private Sub Command134_Click()
        DoCmd.OpenForm "DGLKopiranjeDefaulti", acFormDS
    End Sub
    
    Private Sub DatumDokumenta_AfterUpdate()
      If IsNumeric(Me.RokPlacanja) And IsDate(Me.DatumDokumenta) Then
        Me.DatumPlacanja = DateSerial(Year(Me.DatumDokumenta), Month(Me.DatumDokumenta), _
                                      Day(Me.DatumDokumenta) + Int(Me.RokPlacanja))
      End If
      
      Call InitBrDok
      
      If Not ooisnull(Me.SifMjTr) Then
        If grKO!SecurityPoMjTr Or DCount("*", "MjestaTroska", "VrijediOd IS NOT NULL OR VrijediDo IS NOT NULL") > 0 Then
          ooMsgbox "PAŽNJA: promjena datuma obrisat će upisano mjesto troška, molim da ga ponovno odaberete (jer su aktivne sigurnosne postavke za provjeru valjanosti mjesta troška po periodu!)!", vbInformation
          Me.SifMjTr = Null  'jer je promjenom datuma možda utjecao na source za SifMjTr
        End If
      End If
    End Sub
    
    Private Sub DatumPlacanja_AfterUpdate()
        'rp:
      If IsDate(Me.DatumPlacanja) And IsDate(Me.DatumDokumenta) Then
        Me.RokPlacanja = dateDiff("d", Me.DatumDokumenta, Me.DatumPlacanja)
      End If
    End Sub
    
    
    Public Sub IzBrojDokumenta_AfterUpdate()
      Me.USifDV = Null
      Me.UBrojDokumenta = Null
      IzBrojDokumentaAfterUpdate
    End Sub
    
    Sub IzBrojDokumentaAfterUpdate()
      'Na odabir src dokumenta popuni polja glave i  osvježi ListPredmetiIz:
      'OnClickDokBook, Form_Open, ButSwitch_Click, IzBrojDokumenta_AfterUpdate
      If Not IsNull(Me.IzBrojDokumenta) Then
        Me.PredL = Null
        PredVrstaL = ""
        Me.PredD = Me.PredL
        Me.SifVal = Me.IzBrojDokumenta.Column(IZBD_SifVal)
        Me.Tecaj = Me.IzBrojDokumenta.Column(IZBD_Tecaj)
        Me.SifPartnera = Me.IzBrojDokumenta.Column(IZBD_SifPartnera)
        Me.NazPartnera = Me.IzBrojDokumenta.Column(IZBD_SifPartnera)
        Me.TipRacuna = Me.IzBrojDokumenta.Column(IZBD_TipRacuna)
        Me.SifPDVKnjige = Me.IzBrojDokumenta.Column(IZBD_SifPDVKnjige)
        Me.SifVrOp = Me.IzBrojDokumenta.Column(IZBD_SifVrOp)
        If Me.IzBrojDokumenta.Column(IZBD_SifPred) <> "" Then Me.PredL = Me.IzBrojDokumenta.Column(IZBD_SifPred): PredVrstaL = ""
        Me.PodPred = Me.IzBrojDokumenta.Column(IZBD_PodPred)
        Me.SifMjTr = Me.IzBrojDokumenta.Column(IZBD_SifMjTr)
                
        Me.IzRevBr = Me.IzBrojDokumenta.Column(IZBD_Rev)
        
        Me.URevBr = oonz(DMax("Rev", "DGL", "SifDV = '" & Me.IzSifDV.Column(IZSDV_SifDV) & "' AND BrojDokumenta = '" & Me.IzBrojDokumenta.Column(IZBD_BrojDokumenta) & "'"), 0) + 1
        
        Call PostaviDatumDokumenta
       
        Me.DatumPlacanja = IIf(IsNull(Me.SifPartnera), Null, _
            DateAdd("d", Nz(DLookup("DanPlacanja", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), 0), Me.DatumDokumenta))
        If IsNull(Me.DatumPlacanja) Or Me.DatumPlacanja = "" Then _
            Me.DatumPlacanja = Me.IzBrojDokumenta.Column(IZBD_DatumPlacanja)
        
        Call DatumPlacanja_AfterUpdate
    
        If Me.IzBrojDokumenta.Column(IZBD_SifPodruznice) <> "" Then 'ako je podružnica upisana na izvornom prepiši je i za odredišni
          If oonz(Me.SifPodruznice, "") <> oonz(Me.IzBrojDokumenta.Column(IZBD_SifPodruznice), "") Then
            Me.SifPodruznice = Me.IzBrojDokumenta.Column(IZBD_SifPodruznice)
          End If
    '      If Me.SifPodruznice = "" Then
    '        Me.SifPodruznice = Me.IzBrojDokumenta.Column(IZBD_SifPodruznice)
    '      ElseIf Me.SifPodruznice <> Me.IzBrojDokumenta.Column(IZBD_SifPodruznice) Then
    '        If oomsgbox("Podružnica sa izvornog dokumenta se razlikuje od podružnice za operatera. Da li želite promijeniti podružnicu na podrazumijevanu iz operatera?", vbYesNo + vbDefaultButton1, "OperaOpus") = vbNo Then
    '          Me.SifPodruznice = Me.IzBrojDokumenta.Column(IZBD_SifPodruznice)
    '        End If
    '      End If
        End If
            
        'ako je u izvornom dokumentu upisan datumplacanja, predloži taj datum, inače pogledaj u partnera i na današnji datum dodaj broj dana za plaćanje iz partnera
        
        '  If Me.SifPartnera.Enabled And
        '      IsNull(DLookup("DatumPlacanja", "DGL", "DGLID=" & Me.IzBrojDokumenta.Column(IZBD_DGLID))) Then
        '        .Fields(pom) = DateAdd("d", Nz(DLookup("DanPlacanja", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), 0), Date)
        '  Else
        '    .Fields(pom) = DokRS.Fields(pom)
        '  End If
    
        
        'Pred: ok
        
        Me.ListPredmetiIz.RowSource = "SELECT DGLID, SifDV, BrojDokumenta, PodPred FROM DGL" & _
                " WHERE SifPred='" & Me.IzBrojDokumenta.Column(IZBD_SifPred) & "'" & _
                " ORDER BY SifDV, BrojDokumenta"
        
      End If
    End Sub
    
    
    Private Sub DokBookIz_Click()
      OnClickDokBook Me.DokBookIz, Me.IzSifDV, Me.IzBrojDokumenta, True
    End Sub
    
    Private Sub DokBookU_Click()
      OnClickDokBook Me.DokBookU, Me.USifDV, Me.UBrojDokumenta, False
    End Sub
    
    Sub OnClickDokBook(Lista As control, SifDok As control, BrDok As control, iz As Boolean)
      'poziva se iz: DOkBookIz_Click
      '              DOkBookU_Click
      Dim s As String
      
      If IsNull(Lista.Column(0)) Then Exit Sub
      s = IIf(iz, "Iz", "U") & "SifDV"
      If IsNull(DLookup(s, "DGLKopiranjeDozvole", s & "='" & Lista.Column(1) & "'")) Then
        ooMsgbox "Odabrana vrsta dokumenta (" & Lista.Column(1) & ") nije u dozvoljenim kombinacijama za kopiranje!", vbExclamation
        Exit Sub
      End If
      SifDok = Lista.Column(1)
      
      If iz Then
        IzSifDVAfterUpdate
        BrDok = Lista.Column(0)
        IzBrojDokumentaAfterUpdate
      Else
        Me.UBrojDokumenta = Null
        Me.FrameUDok = UDOK_POSTOJECI
        OnFrameUDokAfterUpdate
        InitBrDok
        Me.UBrojDokumentaC = Lista.Column(0)
        If Me.IzBrojDokumenta.Column(IZBD_DGLID) = Me.UBrojDokumentaC.Column(UBDC_DGLID) Then
          ooMsgbox "Odredišni i izvorni dokument su isti!", vbExclamation
          Me.UBrojDokumentaC = Null
          Exit Sub
        End If
        'Pred:
        Me.PredD = Null
        PredVrstaD = ""
        Me.ListPredmetiU.RowSource = "SELECT DGLID, SifDV, BrojDokumenta, PodPred FROM DGL" & _
                " WHERE SifPred='" & Me.UBrojDokumentaC.Column(UBDC_SifPred) & "'" & _
                " ORDER BY SifDV, BrojDokumenta"
        If Me.UBrojDokumentaC.Column(UBDC_SifPred) <> "" Then Me.PredD = Me.UBrojDokumentaC.Column(UBDC_SifPred): PredVrstaD = ""
        
      End If
      If Not IsNull(Me.USifDV) And Not IsNull(Me.IzSifDV) Then InitKontrole
    End Sub
    
    
    Private Sub Form_Open(Cancel As Integer)
      
      
      
      Set clsForm = mInstantiate.New_cForm()
      Set clsForm.Form = Me
      
      
      Dim UINar As Boolean
      Dim PartnerZaZbirni As Boolean
      Dim DefaultUSifDv
      
      Me.ButDozvoleKopiranja.enabled = Nz(DLookup("SmijeDozvoleKopiranja", "SecOperGrupe", "SifGrupe = " & gsifgrupe), 1)
      Me.ButDozvolePoRobnimGrupama.enabled = Nz(DLookup("SmijeDozvoleKopiranjaAG", "SecOperGrupe", "SifGrupe = " & gsifgrupe), 1)
      
      'IzSifDV
      
      Dim countIzSifDV As Integer
      countIzSifDV = Nz(DCount("*", "SecDV", "SifGrupe=" & gsifgrupe), 0)
      
      PozivSaSemafora = False 'ik 20.12.2016 dodano zbog poziva sa semafora
      
      Me.IzSifDV.RowSource = " SELECT DISTINCT [DGLKopiranjeDozvole].[IzSifDV], [DV].[NazDV], [DV].[SifDV], Rez | CASE WHEN Nar<>0 THEN 1 ELSE 0 END , " & _
                            " DT, MS, UI, DV.SifIzgledaDGL " & _
                            " FROM DGLKopiranjeDozvole INNER JOIN DV ON [DGLKopiranjeDozvole].[IzSifDV]=[DV].[SifDV] " & _
                            IIf(countIzSifDV > 0, " WHERE DGLKopiranjeDozvole.IzSifDV IN (SELECT SifDV FROM SecDV WHERE SifGrupe=" & gsifgrupe & ")", "") & _
                            " ORDER BY [NazDV]"
      
      'Me.IzSifDV.RowSource = " SELECT DISTINCT [DGLKopiranjeDozvole].[IzSifDV], [DV].[NazDV], [DV].[SifDV], Rez | CASE WHEN Nar<>0 THEN 1 ELSE 0 END , " & _
                               " DT, MS, UI " & _
                               " FROM DGLKopiranjeDozvole INNER JOIN DV ON [DGLKopiranjeDozvole].[IzSifDV]=[DV].[SifDV] " & _
                               " ORDER BY [NazDV]" -- ovakav rowsource bio upisan prije promjene i dodavanja secdv u rowsource - hz 06.04.2006
      
      
      Me.cboCijena.RowSource = "'0';'" & TransRpt("ostaje ista") & "';'1';'=0';'2';'" & TransRpt("preračunaj prema tečaju") & "';" & _
                               "'3';'" & TransRpt("povuci cijenu 1 iz artikla") & "';'4';" & _
                               "'" & TransRpt("povuci cijenu 2 iz artikla") & "';'5';'" & TransRpt("povuci cijenu 3 iz artikla") & "';" & _
                               "'6';'" & TransRpt("prema tečaju (obrnuto)") & "';" & _
                               "'7';'" & TransRpt("povuci Koef1 iz artikla") & "';" & _
                               "'8';'" & TransRpt("povuci Koef2 iz artikla") & "';" & _
                               "'9';'" & TransRpt("povuci Koef3 iz artikla") & "';" & _
                               "'10';'" & TransRpt("povuci Koef4 iz artikla") & "'"
                               
      Me.cboCijena.DefaultValue = "='" & SVAMGetSetting("Dok", "CijenaDGLKopiranje", "0") & "'"
      
      Me.cboNar.RowSource = "'1';'" & TransRpt("sve stavke") & "';'2';'" & TransRpt("sve preostale") & "';'3';'" & TransRpt("sve preostale a isporučive") & "';'4';'" & TransRpt("sve preostale a neisporučive") & "'" & ";'5';'" & TransRpt("sve isporučive") & "'"
        
      Me.CboDT.RowSource = "'1';'" & TransRpt("samo = stavke") & "';'2';'" & TransRpt("samo + stavke") & "';'3';'" & TransRpt("sve") & "'"
      
      If gSifPodruzniceZaDokumente <> "" Then
        Me.SifPodruznice = gSifPodruzniceZaDokumente
      End If
        
      If Me.IzSifDV.Column(IZSDV_RezORNar) = True Then
        UINar = (Me.IzSifDV.Column(IZSDV_UI) = "3") 'true za ulaznu nar (Narudžba dobavljaču, a false za Narudžbu kupca)
      End If
        
      If NeDozvoliMinuseNaSklad = True And UINar = False Then
        If Me.CheckStorno = False Then Me.cboNar = "3": Me.cboNar.enabled = False
      Else
        Me.cboNar = "2" 'default za narudžbe dobavljaču je "sve preostale"
      End If
        
      On Error GoTo NoActiveForm
      Set af = Screen.ActiveForm
        
      Select Case af.Name
        Dim DGLID_p As Long, SifDV_p As String, SifPartnera_p As String
        Case "DGL", "StanjeNar", "Nar", "Nar_Wrap", "PregledGlava", "PregledGlava2_Wrap"
          If af.Name = "Nar_Wrap" Then
            DGLID_p = Nz(af.Nar.Form.DGLID, 0)
            SifDV_p = Nz(af.Nar.Form.SifDV, "")
            SifPartnera_p = Nz(af.Nar.Form.SifPartnera, "")
          ElseIf af.Name = "PregledGlava2_Wrap" Then
            DGLID_p = Nz(af.PregledGlava2.Form.DGLID, 0)
            SifDV_p = Nz(af.PregledGlava2.Form.SifDV, "")
            SifPartnera_p = Nz(af.PregledGlava2.Form.SifPartnera, "")
          Else
            DGLID_p = Nz(af.Form.DGLID, 0)
            SifDV_p = Nz(af.Form.SifDV, "")
            SifPartnera_p = Nz(af.Form.SifPartnera, "")
          End If
          If DGLID_p = 0 Then Exit Sub
          If IsNull(DLookup("IzSifDV", "DGLKopiranjeDozvole", "izSifDV='" & SifDV_p & "'")) Then
            ooMsgbox "Odabrana vrsta dokumenta (" & SifDV_p & ") nije u dozvoljenim kombinacijama za kopiranje!", vbExclamation
            Exit Sub
          End If
    
          Me.IzSifDV = SifDV_p
          IzSifDVAfterUpdate
          Me.IzBrojDokumenta = DGLID_p
          IzBrojDokumentaAfterUpdate
          
          'default USifDv iz tablice
          'If Not ooisnull(SifPartnera_p) Then 'ik 06.03.2020 - ako nema partnera onda je false
            PartnerZaZbirni = oonz(DLookup("ZbirniRacun", "Partneri", "SifPartnera = '" & SifPartnera_p & "'"), 0)
            DefaultUSifDv = DLookup("USifDv", "DGLKopiranjeDefaulti", "IzSifDv = '" & Me.IzSifDV & _
                            "' AND ZbirniRacun = " & IIf(PartnerZaZbirni = True, 1, 0) & _
                            " AND " & IIf(KetFisk = True, " FiskalizacijaZaKET = 1 ", " FiskalizacijaZaKET = 0") & _
                            " AND (USifDV IN (SELECT SifDV FROM SecDV WHERE ReadOnly = 0 AND SifGrupe = " & gsifgrupe & ") OR NOT EXISTS (SELECT * FROM SecDV WHERE SifGrupe = " & gsifgrupe & "))")
            If Not ooisnull(DefaultUSifDv) Then
                Me.USifDV.DefaultValue = "= '" & DefaultUSifDv & "'"
                Call USifDV_AfterUpdate
            End If
          'End If
        
        Case "Predmeti"
          'kad bude vremena, dodati i popunjavanje broja dokumenata  iz Predmeta
          
      End Select
      
      If af.Form.Dirty Then af.Form.Dirty = False
    
    NoActiveForm:
    
    End Sub
    
    Public Sub IzSifDV_AfterUpdate()
      IzSifDVAfterUpdate
      CboDTEnabled
    End Sub
    
    Sub CboDTEnabled()
      If Not IsNull(Me.IzSifDV) And Not IsNull(Me.USifDV) Then
        'Me.CboDT.Enabled = CBool((Me.IzSifDV.Column(IZSDV_DT)) = True And Not CBool((Me.USifDV.Column(USDV_DT))))
        Dim DefCboDT As Boolean
        DefCboDT = False
        
        If oonz(DLookup("DefCboDT", "DGLKopiranjeDozvole", "IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "'"), 3) <> 3 Then DefCboDT = True
        Me.CboDT.enabled = CBool(((Me.IzSifDV.Column(IZSDV_DT)) = True Or Me.IzSifDV.Column(IZSDV_MS) = True) And (Not CBool((Me.USifDV.Column(USDV_DT)))) Or DefCboDT)
        If Me.CboDT.enabled = True Then Me.CboDT.Value = oonz(DLookup("DefCboDT", "DGLKopiranjeDozvole", "IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "'"), 3)
        
      Else
        Me.CboDT.enabled = False
      End If
    End Sub
    
    
    Sub IzSifDVAfterUpdate()
    'Zove se iz: IzSifDV_AfterUpdate
    '            OnClickDokBook
    '            Form_Open (ako je kopiranje otvoreno nad dokumentima ili predmetima)
      
      If Not IsNull(Me.IzSifDV) Then
        Me.IzBrojDokumenta.RowSource = "SELECT DGLID, BrojDokumenta, DatumDokumenta, SifPartnera," & _
          " DGL.SifVal, Tcj," & _
          " SifPDVKnjige, SifVrOp, TipRacuna, SifMjTr, SifPred, PodPred, DatumPlacanja, Rev, DGL.SifPodruznice, DGL.SifPartnera2" & _
          " FROM TL INNER JOIN DGL ON (TL.DatumTecaja = DGL.DatumDokumenta) AND (TL.SifVal = DGL.SifVal) " & _
          " WHERE SifDV='" & Me.IzSifDV & "'" & _
          " AND (SifMjtr IN (select SifMjtr from SecOperMjTr where korime='" & gKorIme & "') OR (select count(SifMjtr) from SecOperMjTr where korime='" & gKorIme & "')=0)  " & _
          " ORDER BY DatumDokumenta DESC, BrojDokumenta DESC"
        Me.IzBrojDokumenta.Value = Null
        
        Dim countUSifDV As Integer
        countUSifDV = Nz(DCount("*", "SecDV", "SifGrupe=" & gsifgrupe), 0)
        
        
        Me.USifDV.RowSource = "SELECT DISTINCT DGLKopiranjeDozvole.USifDV, " & IIf(Nz(gCurrentLangID, "HRV") = "HRV", "DV.NazDV", "COALESCE(TRANSDV.NazDVLang, DV.NazDV) NazDV") & " ,DV.SifDV, NacinNumeracije, GrupaNumeracije, " & _
          " FormatBrojaDokumenta, DevizniDokument, GrupaKnjiga, " & _
          " ASkl, cwSifPoz, SifIzgledaDGL, Rez | (CASE WHEN Nar<>0 THEN 1 ELSE 0 END), DefSifPDVKnjige, DefSifVrOp, DT, DV.DefNeASkl, DV.MS, DV.UI " & _
          " FROM DGLKopiranjeDozvole INNER JOIN DV ON DGLKopiranjeDozvole.USifDV = DV.SifDV " & _
          IIf(Nz(gCurrentLangID, "HRV") = "HRV", "", " LEFT JOIN TransDV ON DV.SifDV=TransDV.SifDV AND LangID='" & gCurrentLangID & "'") & _
          " WHERE IzSifDV='" & Me.IzSifDV & "' AND " & IIf(KetFisk = True, " DGLKopiranjeDozvole.FiskalizacijaZaKET = 1 ", " DGLKopiranjeDozvole.FiskalizacijaZaKET = 0") & _
          IIf(countUSifDV > 0, " AND DGLKopiranjeDozvole.USifDV IN (SELECT SifDV FROM SecDV WHERE ReadOnly = 0 AND SifGrupe=" & gsifgrupe & ")", "") & _
          " ORDER BY NazDV "
        
        'ik 21.09.2020 - premjestio kod iza postavljanja RS-a
        'ako je odabran USifDV i kombinacija je dozvoljena, onda OK
        If Not IsNull(Me.USifDV) And DLookup("USifDV", "DGLKopiranjeDozvole", _
                              "IzSifDV='" & Me.IzSifDV & "'") = Me.USifDV Then
          'mm ne treba li ipak postaviti Me.SifDV.RowSource
          Exit Sub
        End If
        
        
        Me.USifDV = Null
        Me.UBrojDokumenta = Null
      
        'Rev kontrole vidljive ili ne; ako je u izvornom dokumentu definirano da se na DGL vidi polje Rev onda prikaži Rev kontrole
        Dim v As Boolean
        v = Not IsNull(DLookup("CtrlName", "DVPoljaDGL", "SifIzgledaDGL='" & Me.IzSifDV.Column(IZSDV_SifIzgledaDGL) & "' AND CtrlName='Rev'"))
        Me.IzRevBr.Visible = v
        Me.URevBr.Visible = v
        Me.OptionRev.Visible = v
      
      End If
      FillNulls
      If Me.IzSifDV.Column(IZSDV_RezORNar) = True Then
        If Me.IzSifDV.Column(IZSDV_UI) = "3" Then
          Me.cboNar = 2 'ulazne narudžbe (nar. dobavljaču), default "sve preostale"
        Else
          Me.cboNar = 3 'izlazne narudžbe (nar. kupca), default "sve preostale, a isporučive"
        End If
      Else
        Me.cboNar = 1
      End If
      
      Me.CheckStorno = 0
      
    End Sub
    
    
    
    '############# Predmeti #############
    
    
    Private Sub ListPredmetiIz_DblClick(Cancel As Integer)
      'Pred:
      GoToDok Nz(Me.ListPredmetiIz, 0), "DGLID"
      DoCmd.Close acForm, "DGLKopiranje"
    End Sub
    
    Private Sub ListPredmetiU_DblClick(Cancel As Integer)
      'Pred:
      GoToDok Nz(Me.ListPredmetiU, 0), "DGLID"
      DoCmd.Close acForm, "DGLKopiranje"
    End Sub
    
    '##########################
    
    Private Sub NazPartnera_AfterUpdate()
      Me.SifPartnera = Me.NazPartnera
      SifNazPartnera_AfterUpdate
    End Sub
    
    Sub SifNazPartnera_AfterUpdate()
      Me.DatumPlacanja = IIf(IsNull(Me.SifPartnera), Null, _
            DateAdd("d", Nz(DLookup("DanPlacanja", "Partneri", "SifPartnera='" & Me.SifPartnera & "'"), 0), Me.DatumDokumenta))
        
      Call DatumPlacanja_AfterUpdate
    End Sub
    
    Private Sub PredD_Change()
    
    On Error Resume Next
    If Me.OptionRev.Value = True Then
        Me.PredD = Me.Parent.SifPred
    End If
    
        NoviPredmet = False
        PredVrstaD = ""
    End Sub
    
    
    Private Sub PredL_Change()
        NoviPredmet = False
        PredVrstaL = ""
    End Sub
    
    
    Private Sub RokPlacanja_AfterUpdate()
      If IsNumeric(Me.RokPlacanja) And IsDate(Me.DatumDokumenta) Then
        Me.DatumPlacanja = DateSerial(Year(Me.DatumDokumenta), Month(Me.DatumDokumenta), _
                                      Day(Me.DatumDokumenta) + Int(Me.RokPlacanja))
      End If
    
    End Sub
    
    
    Private Sub SifMjTr_Enter()
    
    '  If grko!SecurityPoMjTr Then
    '    Me.SifMjTr.RowSource = " SELECT MjestaTroska.SifMjTr, MjestaTroska.NazMjTr " & _
    '                           " FROM MjestaTroska CROSS APPLY fnSecOperMjTr('" & gKorIme & "', MjestaTroska.SifMjTr, " & IIf(ooisnull(Me.DatumDokumenta), " GETDATE() ", sqldate(Me.DatumDokumenta)) & ", NULL, '') " & " ORDER BY MjestaTroska.SifMjTr"
    '  Else
    '    Me.SifMjTr.RowSource = " SELECT MjestaTroska.SifMjTr, MjestaTroska.NazMjTr " & _
    '                           " FROM dbo.MjestaTroska INNER JOIN (Select COUNT(SifGrupe) As Broj FROM dbo.SecMjTr WHERE SecMjTr.SifGrupe=" & gSifGrupe & ") ImaDef ON 1=1 " & _
    '                           " LEFT JOIN dbo.SecMjTr On SecMjTr.SifmjTr = MjestaTroska.SifMjTr AND SecMjTr.SifGrupe=" & gSifGrupe & _
    '                           " WHERE IsNUll(SecMjTr.SiFMjTr,'') = IIF(ImaDef.Broj=0,'', SecMjTr.SifMjTr)" & _
    '                           " ORDER BY MjestaTroska.SifMjTr "
    '  End If
      Call hzFis.Security_SifMjTr_Enter(Me.SifMjTr, oonz(Me.DatumDokumenta, ""))
      
    
    End Sub
    
    Private Sub SifMjTr_Exit(Cancel As Integer)
        'Me.SifMjTr.RowSource = "SELECT MjestaTroska.SifMjTr, MjestaTroska.NazMjTr FROM dbo.MjestaTroska ORDER BY MjestaTroska.SifMjTr"
        Call hzFis.Security_SifMjTr_Exit(Me.SifMjTr)
      
    End Sub
    
    Private Sub SifPodruznice_AfterUpdate()
      Call USifDV_AfterUpdate
    End Sub
    
    Private Sub SifSklad2_AfterUpdate()
      If Not IsNull(Me.SifSklad2) Then Me.FrameSkladista2.Value = SKL_KOR
    End Sub
    
    Public Sub UBrojDokumentaC_AfterUpdate()
      OnFrameUDokAfterUpdate
    End Sub
    
    Public Sub USifDV_AfterUpdate()
      Dim DefSifVal As String
      
      On Error GoTo ErrorHandler
      
      '*****20210413 na temelju zadatka 145132: Pri kopiranju iz OTP, IR zadržao broj od Package liste umjesto da je nastavio svoj niz, zbog promjene na Postojeći dokument u kopiraču
      Me.FrameUDok = UDOK_NOVI
      OnFrameUDokAfterUpdate
      '*****
      
      Me.PredD = Me.PredL
      If PredVrstaL <> "" Then
        PredVrstaD = PredVrstaL
      Else
        PredVrstaD = ""
      End If
      'DatumDokumenta
      Call PostaviDatumDokumenta
     
      If DLookup("DatPlacJeDatIzvDok", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") Then
        Me.DatumPlacanja = Me.IzBrojDokumenta.Column(IZBD_DatumPlacanja)
      End If
      
      DefSifVal = Nz(DLookup("DefSifVal", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      
      If DefSifVal <> "" Then Me.SifVal = DefSifVal
      
      'bj@14.1.2019. - Za Commel je dodana provjera po polju PovuciPDVKnjiguIzPartnera iz podataka vrste dokumenta.
      '                 Ako je to polje postavljeno na 1, neće se prepisati podaci za SifPDVKnjige i SifVrOp iz odredišne vrste dokumenta.
      Dim PDVKnjigaIzPartnera As Boolean
      PDVKnjigaIzPartnera = oonz(DLookup("PovuciPDVKnjiguIzPartnera", "DV", "SifDV = '" & Me.IzSifDV & "'"), False)
      
      InitKontrole
      If grKO Is Nothing Then koInit
      If (oonz(Me.USifDV.Column(USDV_DefSifPDVKnjige), "") <> "" And grKO!KET = False) Or (grKO!KET = True And (IsNull(Me.SifPDVKnjige) Or IsNull(Me.SifVrOp)) And Not IsNull(Me.USifDV.Column(USDV_DefSifPDVKnjige))) Then
        If PDVKnjigaIzPartnera = False Then
            Me.SifPDVKnjige = Me.USifDV.Column(USDV_DefSifPDVKnjige)
            Me.SifVrOp = Me.USifDV.Column(USDV_DefSifVrOp)
        End If
      End If
      CboDTEnabled
        
      Dim CboNarDefault As Integer
      CboNarDefault = oonz(DLookup("CboNarDefault ", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 0)
      OdredisniJeStornoIzlaza = oonz(DLookup("OdredisniJeStornoIzlaza", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), False)
      
      'Podrazumijevano kopiranje negativnih količina
      Me.CheckStorno = DLookup("PodrazumijevanoKopirajNeg", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "'")
      
      If NeDozvoliMinuseNaSklad = True And OdredisniJeStornoIzlaza = False And Me.USifDV.Column(USDV_ASkl) = True And Me.USifDV.Column(USDV_UI) = "0" And Me.CheckStorno = False Then
        'za izlazne dokumente koji ažuriraju skladište, a skladište ne smije u minus, zabetoniraj cboNar
        
        If Me.IzSifDV.Column(IZSDV_RezORNar) = True Then
          'ako je izvorni dokument otvarač/rezervacija, onda sve preostale, a isporučive
          Me.cboNar = cboNAR_PREOSTISP
        Else
          'ako nije, onda sve isporučive
          Me.cboNar = cboNAR_SVEISP
        End If
        
        Me.cboNar.enabled = False
      Else
        Me.cboNar.enabled = True
        If Me.IzSifDV.Column(IZSDV_RezORNar) = True And Me.USifDV.Column(USDV_ASkl) = True Then 'izvorni nar, odredišni askl, onda sve preostale, a isporučive
          
          If Me.IzSifDV.Column(IZSDV_UI) = "3" Then 'izvorni je ulazna narudžba, kopiraj samo preostale
            Me.cboNar = cboNAR_PREOST
          Else
            Me.cboNar = cboNAR_PREOSTISP
          End If
        ElseIf Me.IzSifDV.Column(IZSDV_RezORNar) = True And IIf(DLookup("NarSifDV", "DV", "SifDV='" & Me.USifDV.Column(IZSDV_SifDV) & "'") = Me.IzSifDV.Column(IZSDV_SifDV), True, False) Then 'izvorni je nar, a odredišni je njegov zatvarač, onda sve preostale
          Me.cboNar = cboNAR_PREOST
        Else
          Me.cboNar = cboNAR_SVE
        End If
        
        'bez obzira na ovaj gornji dio (od ELSE nadalje) koji  određuje default za CboNar, pregazi to s definiranim defaultom iz KopiranjeDozvole.CboNarDefault
        'hz 7.3.2013
        If CboNarDefault <> 0 Then Me.cboNar = CboNarDefault
        
        
      End If
    
      If CboNarDefault = cboNAR_SVEISP Then
        Me.cboNar = cboNAR_SVEISP
        Me.cboNar.enabled = False
      End If
      
      'Cijena
      Dim DefKopirajCijenu As String
      DefKopirajCijenu = oonz(DLookup("DefKopirajCijenu", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      If DefKopirajCijenu <> "" Then Me.cboCijena = DefKopirajCijenu
      
      'DefPozicija
      Me.FramePoz.Value = oonz(DLookup("DefKopiPoz", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), 1)
      
      'Revizija
      Dim e As Boolean
      e = (Me.IzSifDV = Me.USifDV)
      
      Me.OptionRev.enabled = e
      If e = False Then
        Me.FrameUDok.Value = UDOK_NOVI
        Me.UBrojDokumenta.enabled = True
      End If
        
      'Ako je zaključan Broj dokumenta u postavkama, ne dozvoli unos broja ručno
      Call ProvjeraZakljBroja
      
      'Preslikavanje def. tipa računa iz odredišnog dokumenta
      Dim TR As String
      TR = oonz(DLookup("DefTipRacuna", "DV", "SifDV = '" & Me.USifDV & "'"), "")
      If Me.TipRacuna.enabled And TR <> "" Then
        Me.TipRacuna = TR
      End If
    
      'hz 7.12.2016
      Dim KopiStavkePoZaglavljima As Integer
      KopiStavkePoZaglavljima = DLookup("KopiStavkePoZaglavljima", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
    
      Select Case KopiStavkePoZaglavljima
        Case 0
          Me.ChkKopiranjeStavakaPoZaglavljima.Visible = False
          Me.ChkKopiranjeStavakaPoZaglavljima.Value = False
        Case 1
          Me.ChkKopiranjeStavakaPoZaglavljima.Visible = True
          Me.ChkKopiranjeStavakaPoZaglavljima.Value = True
        Case 2
          Me.ChkKopiranjeStavakaPoZaglavljima.Visible = True
          Me.ChkKopiranjeStavakaPoZaglavljima.Value = False
    
      End Select
      
      'bj@15.03.2019. - provjera i postavljanje datuma plaćanja novog dokumenta
      '                 gleda se postavka KopiDosp iz dozvola kopiranja. MR - Commel
      Dim KD As Integer
      KD = DLookup("KopiDosp", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")
      
      If KD = 2 Then
        ' kopiranje datuma plaćanja s pomakom u datumima sa kopiranog dokumenta
        ' gleda se preko postavke DatDospIzDatIsporuke sa dokumenta koji se kopira da bi se dobio broj dana za plaćanje
        Dim DatumPlacanjaIZ As String
        Dim DatumDokumentaIZ As Date
        Dim DatumIsporukeIZ As String
        Dim DatumOpcijeIZ As String
        Dim BrojDanaIZ As Integer
        Dim DatDospIzDatIsporuke As String
        
        DatumPlacanjaIZ = oonz(DLookup("DatumPlacanja", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
        DatumDokumentaIZ = DLookup("DatumDokumenta", "DGL", "DGLID = " & Me.IzBrojDokumenta)
        DatumIsporukeIZ = oonz(DLookup("DatumIsporuke", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
        DatumOpcijeIZ = oonz(DLookup("DatumOpcije", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
        DatDospIzDatIsporuke = oonz(DLookup("DatDospIzDatIsporuke", "DV", "SifDV = '" & Me.IzSifDV & "'"), "0")
        
        'DatDospIzDatIsporuke može biti:
        '0 - datum dokumenta
        '1 - datum isporuke
        '2 - datum opcije
        
        If DatumPlacanjaIZ <> "" Then
        
            'Izračuna broj dana za plaćanje
            If DatDospIzDatIsporuke = "0" Then
                BrojDanaIZ = dateDiff("d", DatumDokumentaIZ, CDate(DatumPlacanjaIZ))
            ElseIf DatDospIzDatIsporuke = "1" Then
                BrojDanaIZ = dateDiff("d", IIf(DatumIsporukeIZ <> "", CDate(DatumIsporukeIZ), DatumDokumentaIZ), CDate(DatumPlacanjaIZ))
            ElseIf DatDospIzDatIsporuke = "2" Then
                BrojDanaIZ = dateDiff("d", IIf(DatumOpcijeIZ <> "", CDate(DatumOpcijeIZ), DatumDokumentaIZ), CDate(DatumPlacanjaIZ))
            End If
                
            Me.RokPlacanja = BrojDanaIZ
            Call RokPlacanja_AfterUpdate
        
        End If
      ElseIf KD = 1 Then
        DatumPlacanjaIZ = oonz(DLookup("DatumPlacanja", "DGL", "DGLID = " & Me.IzBrojDokumenta), "")
        If DatumPlacanjaIZ <> "" Then
            Me.DatumPlacanja = DatumPlacanjaIZ
        End If
      End If
      
      'KopirajSamoZaglavlje
      If DLookup("KopirajSamoZaglavlje", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'") = False Then
        Me.CheckSamoGlava.Value = False
      Else
        Me.CheckSamoGlava.Value = True
      End If
      
      'bj@15.11.2019. - prebaci vrstu oporezivanja u slučaju storna na onu iz odredišnog dokumenta samo ako ju odredišni dokument ima
      If Me.CheckStorno = True And oonz(Me.IzBrojDokumenta.Column(IZBD_SifVrOp), "") <> "" Then
        'bj@24.10.2019. - u slučaju STORNO kopiranja, vrati PDVKnjigu i Vrstu oporezivanja kako je na dokumentu kojeg se kopira
        Me.SifPDVKnjige = Me.IzBrojDokumenta.Column(IZBD_SifPDVKnjige)
        Me.SifVrOp = Me.IzBrojDokumenta.Column(IZBD_SifVrOp)
      End If
      
      'bj@25.9.2020. - postavljanje rowsource-a za SifVrOp nakon default postavljanja odredišne vrste dokumenta
      Call SetSifVrOpRowSource
    
      Exit Sub
      
    ErrorHandler:
        ooMsgboxError "DGLKopi->uSifDV->After update"
    End Sub
    
    Sub ProvjeraZakljBroja()
        If oonz(DLookup("LockBrojDokumenta", "DV", "SifDv = '" & Me.USifDV & "'"), False) = True Or _
          oonz(DLookup("CtrlIme", "SecOperGrupe_Kontrole", "FrmIme = 'DGL' AND SifDV = '" & Me.USifDV & "' AND CtrlIme = 'BrojDokumenta' AND SifGrupe = " & gsifgrupe & " AND Editable = 0"), "") <> "" Then
          Me.UBrojDokumenta.Locked = True
        Else
          Me.UBrojDokumenta.Locked = False
        End If
    End Sub
    
    
    Private Sub USifDV_BeforeUpdate(Cancel As Integer)
      If IsNull(Me.IzSifDV) Then
        Cancel = True
        Me.USifDV.Undo
        ooMsgbox "Nije odabran izvorni dokument!", vbInformation
      End If
    End Sub
    
    
    Private Sub USifDV_LostFocus()
      If IsNull(Me.IzSifDV) Then Me.USifDV = Null
    End Sub
    
    
    Private Sub SifMjTroskaST_AfterUpdate()
      If Not IsNull(Me.SifMjTrST) Then Me.FrameMjTr.Value = MJTR_KOR
    End Sub
    
    Private Sub SifPartnera_AfterUpdate()
      Me.NazPartnera = Me.SifPartnera
      SifNazPartnera_AfterUpdate
    
    
    End Sub
    
    Sub InitBrDok()
      Dim BrojDokumentaU As String
      
      On Error GoTo ErrorHandler
      
      If IsNull(Me.IzSifDV) Or IsNull(Me.USifDV) Then Exit Sub
      
      BrojDokumentaU = oonz(DLookup("BrojDokumentaU", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'"), "")
      
      If Me.FrameUDok = UDOK_POSTOJECI Then
        Me.UBrojDokumentaC.RowSource = "SELECT DGLID, BrojDokumenta, DatumDokumenta, SifPartnera, SifPred " & _
        " FROM DGL WHERE SifDV='" & Me.USifDV & "' AND  ObrRazID IS NULL AND Knjizeno=0 AND DatumDokumenta BETWEEN " & sqldate(gObrRazdOD) & " AND " & sqldate(gObrRazdDO) & _
        " ORDER BY DGL.DatumDokumenta DESC "
      ElseIf Me.FrameUDok = UDOK_NOVI Then
        'slijedeći broj dokumenta odabrane vrste
        Me.UBrojDokumenta.SetFocus
        Me.UBrojDokumenta = " "
        
        If BrojDokumentaU = "BrojDokumenta" Then
            Me.UBrojDokumenta = DLookup("BrojDokumenta", "DGL", "DGLID = " & Me.IzBrojDokumenta)
        Else
            OnChangeBrojDokumenta Me, Me.USifDV.Column(USDV_NacinNumeracije), _
                              Me.USifDV.Column(USDV_GrupaNumeracije), Me.USifDV.Column(USDV_FormatBrojaDokumenta), _
                              Me.UBrojDokumenta, Me.USifDV, Year(Me.DatumDokumenta), Me.SifVal, Me.IntBrojDokumenta, Me.SifMjTr, Me.SifPodruznice
    
        End If
          
          
        Else 'ništa - UDOK_REV
      End If
      
      Exit Sub
      
    ErrorHandler:
        ooMsgboxError "InitBrDok"
    End Sub
    
    Sub InitKontrole()
    
      InitBrDok
      
      '****o(ne)mogući kontrole glave
      'grupa knjiga
      If Not IsNull(Me.USifDV.Column(USDV_GrupaKnjiga)) Then
        Me.SifPDVKnjige.RowSource = "SELECT SifPDVKnjige, NazKnjige FROM PDVKnjige" & _
            " WHERE GrupaKnjiga='" & Nz(Me.USifDV.Column(USDV_GrupaKnjiga), "") & "' ORDER BY NazKnjige"
        SetSifVrOpRowSource
      End If
      
      Me.SifVal.enabled = Me.USifDV.Column(USDV_DevizniDokument) 'devizni dokument
      
      'partner u glavi
      If Not IsNull(DLookup("CtrlName", "DVPoljaDGL", "SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & "' AND CtrlName='SifPartnera'")) Then
        Me.SifPartnera.enabled = True
        Me.NazPartnera.enabled = True
      Else
        Me.SifPartnera.enabled = False
        Me.NazPartnera.enabled = False
      End If
      
      'mjesto troška u glavi
      If Not IsNull(DLookup("CtrlName", "DVPoljaDGL", "SifIzgledaDGL='" & Me.USifDV.Column(USDV_SifIzgledaDGL) & "' AND CtrlName='SifMjTr'")) Then
        Me.SifMjTr.enabled = True
      Else
        Me.SifMjTr.enabled = False
      End If
      
      Me.TipRacuna.enabled = Me.USifDV.Column(USDV_GrupaKnjiga) <> ""
      Me.SifPDVKnjige.enabled = Me.USifDV.Column(USDV_GrupaKnjiga) <> ""
      Me.SifVrOp.enabled = Me.USifDV.Column(USDV_GrupaKnjiga) <> ""
      
      If Not IsNull(Me.USifDV.Column(USDV_GrupaKnjiga)) Then
        If ooisnull(Me.TipRacuna) Then Me.TipRacuna = Nz(DLookup("DefTipRacuna", "Korisnik"), "") 'default tip računa
        Me.SifPDVKnjige.RowSource = "SELECT SifPDVKnjige,NazKnjige FROM PDVKnjige WHERE GrupaKnjiga='" & Me.USifDV.Column(USDV_GrupaKnjiga) & "'"
        SetSifVrOpRowSource
      End If
      
      Me.FrameMjTr.Value = MJTR_DOK
      Me.FrameSkladista.Value = SKL_DOK
      Me.FrameSkladista2.Value = SKL_DOK
      Me.FramePoz.Value = POZ_NEDEF
    End Sub
    
    Sub FillNulls()
      Me.SifVal = Null
      Me.Tecaj = Null
      Me.SifPartnera = Null
      Me.NazPartnera = Null
      Me.SifMjTr = Null
      Me.TipRacuna = ""
      Me.SifPDVKnjige = Null
      Me.SifSklad = Null
      Me.SifSklad2 = Null
    End Sub
    
    
    Private Sub SetSifVrOpRowSource()
        If Nz(Me.SifPDVKnjige, "") <> "" Then
            Me.SifVrOp.RowSource = "SELECT SifVrOp, NazVrOp FROM PDVVrOp WHERE SifPDVKnjige='" & Me.SifPDVKnjige & "' "
        End If
    End Sub
    
    Private Sub SifPDVKnjige_AfterUpdate()
      SetSifVrOpRowSource
      Me.SifVrOp = Null
    End Sub
    
    
    Private Sub SifSklad_AfterUpdate()
      If Not IsNull(Me.SifSklad) Then Me.FrameSkladista.Value = SKL_KOR
    End Sub
    
    '#########################
    
    
    Private Sub ButDozvoleKopiranja_Click()
      DoCmd.OpenForm "DGLKopiranjeDozvole", acFormDS
    End Sub
    
    
    Public Sub FrameUDok_AfterUpdate()
      OnFrameUDokAfterUpdate
    End Sub
    
    Sub OnFrameUDokAfterUpdate()
    'Poziva se iz: FrameUDok_AfterUpdate
    '              OnClickDokBook
      Me.UBrojDokumenta.enabled = (Me.FrameUDok = UDOK_NOVI)
      Me.UBrojDokumentaC.enabled = (Me.FrameUDok = UDOK_POSTOJECI)
      If Me.FrameUDok <> UDOK_REV Then InitBrDok
      'Pred:
      Me.PredD = Me.PredL
      PredVrstaD = PredVrstaL
      If Me.FrameUDok = UDOK_POSTOJECI Then 'mm bilo na NOVI ??
        
        Me.ListPredmetiU.RowSource = "SELECT DGLID, SifDV, BrojDokumenta, PodPred FROM DGL" & _
                " WHERE SifPred='" & Me.UBrojDokumentaC.Column(UBDC_SifPred) & "'" & _
                " ORDER BY SifDV, BrojDokumenta"
        If Me.UBrojDokumentaC.Column(UBDC_SifPred) <> "" Then Me.PredD = Me.UBrojDokumentaC.Column(UBDC_SifPred): PredVrstaD = ""
        If IsNull(Me.PredL) Then Me.PredL = IIf(Me.UBrojDokumentaC.Column(UBDC_SifPred) = "", Null, Me.UBrojDokumentaC.Column(UBDC_SifPred)): PredVrstaL = ""
      Else
        Me.ListPredmetiU.RowSource = ""
      End If
      Call ProvjeraZakljBroja
    End Sub
    
    Private Sub CheckStorno_AfterUpdate()
      Me.CheckStorno.Controls(0).ForeColor = IIf(Me.CheckStorno, 255, 0)
      Me.CheckPov.enabled = IIf(Me.USifDV.Column(USDV_MS) = True, False, Me.CheckStorno)
      If Me.CheckPov.enabled = False Then Me.CheckPov.Value = False
      
      If Me.CheckStorno Then
        Me.cboNar = "1"
        
        'bj@24.10.2019. - u slučaju STORNO kopiranja, vrati PDVKnjigu i Vrstu oporezivanja kako je na dokumentu kojeg se kopira
        'bj@30.03.2020. - vrati iz dokumenta koji se kopira samo ako na njemu postoje ti podaci
        If oonz(Me.IzBrojDokumenta.Column(IZBD_SifPDVKnjige), "") <> "" And oonz(Me.IzBrojDokumenta.Column(IZBD_SifVrOp), "") <> "" Then
            Me.SifPDVKnjige = Me.IzBrojDokumenta.Column(IZBD_SifPDVKnjige)
            Me.SifVrOp = Me.IzBrojDokumenta.Column(IZBD_SifVrOp)
        End If
      Else
        Call USifDV_AfterUpdate
      End If
    End Sub
    
    
    Function hzInstr(Trazim As String, TrazimU As String) As Boolean
      Dim i As Integer, ub As Integer
      Dim aTrazimU() As String
      
      If TrazimU = "" Then
        hzInstr = False
        Exit Function
      End If
      
      aTrazimU = Split(TrazimU, ",")
      ub = UBound(aTrazimU)
      
      hzInstr = False
      
      For i = 0 To ub
        If Trazim = Trim(aTrazimU(i)) Then
          hzInstr = True
          Exit Function
        End If
      Next i
    
      
    End Function
    
    Private Function GetFirstOpenDate() As Date
      Dim rst As ADODB.Recordset
      Set rst = CurrentProject.Connection.Execute("SELECT DATEADD(d,1,ZadnjiDatum) FROM (SELECT MAX(Datum) AS ZadnjiDatum FROM (SELECT ZakljucajPDVDo AS Datum FROM Korisnik2 UNION ALL SELECT MAX(DatumObrRaz) AS Datum FROM ObracunskaRazdoblja UNION ALL SELECT DATEADD(d,-1,CAST(CAST(YEAR(DatumPrivremenogZakljucavanja) AS varchar) + '-' + CAST(MONTH(DatumPrivremenogZakljucavanja) AS varchar) + '-' + '01' AS SMALLDATETIME)) AS Datum FROM Korisnik2 WHERE DatumPrivremenogZakljucavanja IS NOT NULL) t ) z")
      
      GetFirstOpenDate = rst.Fields(0)
    End Function
    
    Private Function KetGenPNBO(DokID As Long)
        Dim R As Recordset
        Set R = New Recordset
        
        'KET format: Šifra partnera-Poslovna jedinicaTip dokumenta-GodinaBroj
        R.Open "SELECT DGL.SifPartnera + '-' + DGL.SifMjTr + DGL.SifDV + '-' + RIGHT(CAST(DGL.Godina AS NVARCHAR(5)), 2) + RIGHT('000' + CAST(DGL.IntBrojDokumenta As NVARCHAR(4)), 4) As PNBO FROM DGL WHERE DGL.DGLID = " & DokID, CurrentProject.Connection, adOpenStatic
        
        If Not R.EOF And Not ooisnull(R!PNBO) Then
            KetGenPNBO = R!PNBO
        Else
            ooMsgbox "Neuspješno generiranje PNBO!"
            Exit Function
        End If
        
        R.Close
        Set R = Nothing
    End Function
    
    Sub PostaviDatumDokumenta()
      'kompletna logika datuma za kopiranje je smjesštena u rowsourcu za stupac 17 comba iz sifdv
      Dim DatumUDatumDokumenta As String, IzrazZaDatumDokumenta As String
    
      If Not IsNull(Me.IzSifDV) And Not IsNull(Me.USifDV) Then
        DatumUDatumDokumenta = Nz(DLookup("DatumUDatumDokumenta", "DGLKopiranjeDozvole", "IzSifDV = '" & Me.IzSifDV & "' AND USifDV = '" & Me.USifDV & "'"), "")
        If DatumUDatumDokumenta <> "" Then
          Me.DatumDokumenta = Nz(DLookup(DatumUDatumDokumenta, "DGL", "DGLID=" & Me.IzBrojDokumenta), Date)
          DatumUDatumDokumenta = "DGL." & DatumUDatumDokumenta
        ElseIf (DLookup("OrigDatum", "DGLKopiranjeDozvole", "IzSifDV='" & Me.IzSifDV & "' AND USifDV='" & Me.USifDV & "'")) = True Then
          Me.DatumDokumenta = Nz(DLookup("DatumDokumenta", "DGL", "DGLID=" & Me.IzBrojDokumenta), Date)
          DatumUDatumDokumenta = "DGL.DatumDokumenta"
        Else
          Me.DatumDokumenta = Date
        End If
      Else
        Me.DatumDokumenta = Date
      End If
     
      Call RokPlacanja_AfterUpdate 'bj@13.12.2019. - dodano zbog zadataka za Mlakare gdje su rekli da se datum plaćanja ne uveća za broj dana od originalnog datuma koji se kopira
    End Sub
    
    Sub Provjeri_blokadu()
        'bj@30.08.21. - provjera blokade partnera
        If oonz(DLookup("BisnodeUrl", "Korisnik2", ""), "") <> "" Then
            If oonz(DLookup("BisnodeBlokadaPartnera", "DV", "SifDV = '" & Me.USifDV & "'"), False) = True Then
              Dim provjera_blokada As String
              If oonz(Me.SifPartnera.Column(2), "") <> "" Then
                  'MWait
                  provjera_blokada = DLookup("dbo.fnBisnode_Partner('', '0', BisnodeUrl, BisnodeUsername, BisnodePassword, '" & Me.SifPartnera.Column(2) & "', 'blokada_racuna,broj_dana_blokiran,aktivnost_opis')", "Korisnik2", "")
                  'MNorm
                  If InStr(1, provjera_blokada, ": DA") > 0 Then
                    ooMsgbox provjera_blokada, vbExclamation + vbOKOnly, "Poslovna.hr"
                  End If
              End If
            End If
        End If
    End Sub
    `

    constructor() {

    }


    parse() {


    }
}