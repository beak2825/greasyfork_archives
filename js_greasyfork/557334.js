// ==UserScript==
// @name         Synqly - Get Synced Lyrics for YouTube Music
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace YouTube Music lyrics with synced lyrics from LRCLib. The whole code is AI generated, but I surely will keep it updated whenever Youtube tries to mix up the interface.
// @author       You
// @match        https://music.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      lrclib.net
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/557334/Synqly%20-%20Get%20Synced%20Lyrics%20for%20YouTube%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/557334/Synqly%20-%20Get%20Synced%20Lyrics%20for%20YouTube%20Music.meta.js
// ==/UserScript==

/*
                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

  The licenses for most software and other practical works are designed
to take away your freedom to share and change the works.  By contrast,
the GNU General Public License is intended to guarantee your freedom to
share and change all versions of a program--to make sure it remains free
software for all its users.  We, the Free Software Foundation, use the
GNU General Public License for most of our software; it applies also to
any other work released this way by its authors.  You can apply it to
your programs, too.

  When we speak of free software, we are referring to freedom, not
price.  Our General Public Licenses are designed to make sure that you
have the freedom to distribute copies of free software (and charge for
them if you wish), that you receive source code or can get it if you
want it, that you can change the software or use pieces of it in new
free programs, and that you know you can do these things.

  To protect your rights, we need to prevent others from denying you
these rights or asking you to surrender the rights.  Therefore, you have
certain responsibilities if you distribute copies of the software, or if
you modify it: responsibilities to respect the freedom of others.

  For example, if you distribute copies of such a program, whether
gratis or for a fee, you must pass on to the recipients the same
freedoms that you received.  You must make sure that they, too, receive
or can get the source code.  And you must show them these terms so they
know their rights.

  Developers that use the GNU GPL protect your rights with two steps:
(1) assert copyright on the software, and (2) offer you this License
giving you legal permission to copy, distribute and/or modify it.

  For the developers' and authors' protection, the GPL clearly explains
that there is no warranty for this free software.  For both users' and
authors' sake, the GPL requires that modified versions be marked as
changed, so that their problems will not be attributed erroneously to
authors of previous versions.

  Some devices are designed to deny users access to install or run
modified versions of the software inside them, although the manufacturer
can do so.  This is fundamentally incompatible with the aim of
protecting users' freedom to change the software.  The systematic
pattern of such abuse occurs in the area of products for individuals to
use, which is precisely where it is most unacceptable.  Therefore, we
have designed this version of the GPL to prohibit the practice for those
products.  If such problems arise substantially in other domains, we
stand ready to extend this provision to those domains in future versions
of the GPL, as needed to protect the freedom of users.

  Finally, every program is threatened constantly by software patents.
States should not allow patents to restrict development and use of
software on general-purpose computers, but in those that do, we wish to
avoid the special danger that patents applied to a free program could
make it effectively proprietary.  To prevent this, the GPL assures that
patents cannot be used to render the program non-free.

  The precise terms and conditions for copying, distribution and
modification follow.

                       TERMS AND CONDITIONS

  0. Definitions.

  "This License" refers to version 3 of the GNU General Public License.

  "Copyright" also means copyright-like laws that apply to other kinds of
works, such as semiconductor masks.

  "The Program" refers to any copyrightable work licensed under this
License.  Each licensee is addressed as "you".  "Licensees" and
"recipients" may be individuals or organizations.

  To "modify" a work means to copy from or adapt all or part of the work
in a fashion requiring copyright permission, other than the making of an
exact copy.  The resulting work is called a "modified version" of the
earlier work or a work "based on" the earlier work.

  A "covered work" means either the unmodified Program or a work based
on the Program.

  To "propagate" a work means to do anything with it that, without
permission, would make you directly or secondarily liable for
infringement under applicable copyright law, except executing it on a
computer or modifying a private copy.  Propagation includes copying,
distribution (with or without modification), making available to the
public, and in some countries other activities as well.

  To "convey" a work means any kind of propagation that enables other
parties to make or receive copies.  Mere interaction with a user through
a computer network, with no transfer of a copy, is not conveying.

  An interactive user interface displays "Appropriate Legal Notices"
to the extent that it includes a convenient and prominently visible
feature that (1) displays an appropriate copyright notice, and (2)
tells the user that there is no warranty for the work (except to the
extent that warranties are provided), that licensees may convey the
work under this License, and how to view a copy of this License.  If
the interface presents a list of user commands or options, such as a
menu, a prominent item in the list meets this criterion.

  1. Source Code.

  The "source code" for a work means the preferred form of the work
for making modifications to it.  "Object code" means any non-source
form of a work.

  A "Standard Interface" means an interface that either is an official
standard defined by a recognized standards body, or, in the case of
interfaces specified for a particular programming language, one that
is widely used among developers working in that language.

  The "System Libraries" of an executable work include anything, other
than the work as a whole, that (a) is included in the normal form of
packaging a Major Component, but which is not part of that Major
Component, and (b) serves only to enable use of the work with that
Major Component, or to implement a Standard Interface for which an
implementation is available to the public in source code form.  A
"Major Component", in this context, means a major essential component
(kernel, window system, and so on) of the specific operating system
(if any) on which the executable work runs, or a compiler used to
produce the work, or an object code interpreter used to run it.

  The "Corresponding Source" for a work in object code form means all
the source code needed to generate, install, and (for an executable
work) run the object code and to modify the work, including scripts to
control those activities.  However, it does not include the work's
System Libraries, or general-purpose tools or generally available free
programs which are used unmodified in performing those activities but
which are not part of the work.  For example, Corresponding Source
includes interface definition files associated with source files for
the work, and the source code for shared libraries and dynamically
linked subprograms that the work is specifically designed to require,
such as by intimate data communication or control flow between those
subprograms and other parts of the work.

  The Corresponding Source need not include anything that users
can regenerate automatically from other parts of the Corresponding
Source.

  The Corresponding Source for a work in source code form is that
same work.

  2. Basic Permissions.

  All rights granted under this License are granted for the term of
copyright on the Program, and are irrevocable provided the stated
conditions are met.  This License explicitly affirms your unlimited
permission to run the unmodified Program.  The output from running a
covered work is covered by this License only if the output, given its
content, constitutes a covered work.  This License acknowledges your
rights of fair use or other equivalent, as provided by copyright law.

  You may make, run and propagate covered works that you do not
convey, without conditions so long as your license otherwise remains
in force.  You may convey covered works to others for the sole purpose
of having them make modifications exclusively for you, or provide you
with facilities for running those works, provided that you comply with
the terms of this License in conveying all material for which you do
not control copyright.  Those thus making or running the covered works
for you must do so exclusively on your behalf, under your direction
and control, on terms that prohibit them from making any copies of
your copyrighted material outside their relationship with you.

  Conveying under any other circumstances is permitted solely under
the conditions stated below.  Sublicensing is not allowed; section 10
makes it unnecessary.

  3. Protecting Users' Legal Rights From Anti-Circumvention Law.

  No covered work shall be deemed part of an effective technological
measure under any applicable law fulfilling obligations under article
11 of the WIPO copyright treaty adopted on 20 December 1996, or
similar laws prohibiting or restricting circumvention of such
measures.

  When you convey a covered work, you waive any legal power to forbid
circumvention of technological measures to the extent such circumvention
is effected by exercising rights under this License with respect to
the covered work, and you disclaim any intention to limit operation or
modification of the work as a means of enforcing, against the work's
users, your or third parties' legal rights to forbid circumvention of
technological measures.

  4. Conveying Verbatim Copies.

  You may convey verbatim copies of the Program's source code as you
receive it, in any medium, provided that you conspicuously and
appropriately publish on each copy an appropriate copyright notice;
keep intact all notices stating that this License and any
non-permissive terms added in accord with section 7 apply to the code;
keep intact all notices of the absence of any warranty; and give all
recipients a copy of this License along with the Program.

  You may charge any price or no price for each copy that you convey,
and you may offer support or warranty protection for a fee.

  5. Conveying Modified Source Versions.

  You may convey a work based on the Program, or the modifications to
produce it from the Program, in the form of source code under the
terms of section 4, provided that you also meet all of these conditions:

    a) The work must carry prominent notices stating that you modified
    it, and giving a relevant date.

    b) The work must carry prominent notices stating that it is
    released under this License and any conditions added under section
    7.  This requirement modifies the requirement in section 4 to
    "keep intact all notices".

    c) You must license the entire work, as a whole, under this
    License to anyone who comes into possession of a copy.  This
    License will therefore apply, along with any applicable section 7
    additional terms, to the whole of the work, and all its parts,
    regardless of how they are packaged.  This License gives no
    permission to license the work in any other way, but it does not
    invalidate such permission if you have separately received it.

    d) If the work has interactive user interfaces, each must display
    Appropriate Legal Notices; however, if the Program has interactive
    interfaces that do not display Appropriate Legal Notices, your
    work need not make them do so.

  A compilation of a covered work with other separate and independent
works, which are not by their nature extensions of the covered work,
and which are not combined with it such as to form a larger program,
in or on a volume of a storage or distribution medium, is called an
"aggregate" if the compilation and its resulting copyright are not
used to limit the access or legal rights of the compilation's users
beyond what the individual works permit.  Inclusion of a covered work
in an aggregate does not cause this License to apply to the other
parts of the aggregate.

  6. Conveying Non-Source Forms.

  You may convey a covered work in object code form under the terms
of sections 4 and 5, provided that you also convey the
machine-readable Corresponding Source under the terms of this License,
in one of these ways:

    a) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by the
    Corresponding Source fixed on a durable physical medium
    customarily used for software interchange.

    b) Convey the object code in, or embodied in, a physical product
    (including a physical distribution medium), accompanied by a
    written offer, valid for at least three years and valid for as
    long as you offer spare parts or customer support for that product
    model, to give anyone who possesses the object code either (1) a
    copy of the Corresponding Source for all the software in the
    product that is covered by this License, on a durable physical
    medium customarily used for software interchange, for a price no
    more than your reasonable cost of physically performing this
    conveying of source, or (2) access to copy the
    Corresponding Source from a network server at no charge.

    c) Convey individual copies of the object code with a copy of the
    written offer to provide the Corresponding Source.  This
    alternative is allowed only occasionally and noncommercially, and
    only if you received the object code with such an offer, in accord
    with subsection 6b.

    d) Convey the object code by offering access from a designated
    place (gratis or for a charge), and offer equivalent access to the
    Corresponding Source in the same way through the same place at no
    further charge.  You need not require recipients to copy the
    Corresponding Source along with the object code.  If the place to
    copy the object code is a network server, the Corresponding Source
    may be on a different server (operated by you or a third party)
    that supports equivalent copying facilities, provided you maintain
    clear directions next to the object code saying where to find the
    Corresponding Source.  Regardless of what server hosts the
    Corresponding Source, you remain obligated to ensure that it is
    available for as long as needed to satisfy these requirements.

    e) Convey the object code using peer-to-peer transmission, provided
    you inform other peers where the object code and Corresponding
    Source of the work are being offered to the general public at no
    charge under subsection 6d.

  A separable portion of the object code, whose source code is excluded
from the Corresponding Source as a System Library, need not be
included in conveying the object code work.

  A "User Product" is either (1) a "consumer product", which means any
tangible personal property which is normally used for personal, family,
or household purposes, or (2) anything designed or sold for incorporation
into a dwelling.  In determining whether a product is a consumer product,
doubtful cases shall be resolved in favor of coverage.  For a particular
product received by a particular user, "normally used" refers to a
typical or common use of that class of product, regardless of the status
of the particular user or of the way in which the particular user
actually uses, or expects or is expected to use, the product.  A product
is a consumer product regardless of whether the product has substantial
commercial, industrial or non-consumer uses, unless such uses represent
the only significant mode of use of the product.

  "Installation Information" for a User Product means any methods,
procedures, authorization keys, or other information required to install
and execute modified versions of a covered work in that User Product from
a modified version of its Corresponding Source.  The information must
suffice to ensure that the continued functioning of the modified object
code is in no case prevented or interfered with solely because
modification has been made.

  If you convey an object code work under this section in, or with, or
specifically for use in, a User Product, and the conveying occurs as
part of a transaction in which the right of possession and use of the
User Product is transferred to the recipient in perpetuity or for a
fixed term (regardless of how the transaction is characterized), the
Corresponding Source conveyed under this section must be accompanied
by the Installation Information.  But this requirement does not apply
if neither you nor any third party retains the ability to install
modified object code on the User Product (for example, the work has
been installed in ROM).

  The requirement to provide Installation Information does not include a
requirement to continue to provide support service, warranty, or updates
for a work that has been modified or installed by the recipient, or for
the User Product in which it has been modified or installed.  Access to a
network may be denied when the modification itself materially and
adversely affects the operation of the network or violates the rules and
protocols for communication across the network.

  Corresponding Source conveyed, and Installation Information provided,
in accord with this section must be in a format that is publicly
documented (and with an implementation available to the public in
source code form), and must require no special password or key for
unpacking, reading or copying.

  7. Additional Terms.

  "Additional permissions" are terms that supplement the terms of this
License by making exceptions from one or more of its conditions.
Additional permissions that are applicable to the entire Program shall
be treated as though they were included in this License, to the extent
that they are valid under applicable law.  If additional permissions
apply only to part of the Program, that part may be used separately
under those permissions, but the entire Program remains governed by
this License without regard to the additional permissions.

  When you convey a copy of a covered work, you may at your option
remove any additional permissions from that copy, or from any part of
it.  (Additional permissions may be written to require their own
removal in certain cases when you modify the work.)  You may place
additional permissions on material, added by you to a covered work,
for which you have or can give appropriate copyright permission.

  Notwithstanding any other provision of this License, for material you
add to a covered work, you may (if authorized by the copyright holders of
that material) supplement the terms of this License with terms:

    a) Disclaiming warranty or limiting liability differently from the
    terms of sections 15 and 16 of this License; or

    b) Requiring preservation of specified reasonable legal notices or
    author attributions in that material or in the Appropriate Legal
    Notices displayed by works containing it; or

    c) Prohibiting misrepresentation of the origin of that material, or
    requiring that modified versions of such material be marked in
    reasonable ways as different from the original version; or

    d) Limiting the use for publicity purposes of names of licensors or
    authors of the material; or

    e) Declining to grant rights under trademark law for use of some
    trade names, trademarks, or service marks; or

    f) Requiring indemnification of licensors and authors of that
    material by anyone who conveys the material (or modified versions of
    it) with contractual assumptions of liability to the recipient, for
    any liability that these contractual assumptions directly impose on
    those licensors and authors.

  All other non-permissive additional terms are considered "further
restrictions" within the meaning of section 10.  If the Program as you
received it, or any part of it, contains a notice stating that it is
governed by this License along with a term that is a further
restriction, you may remove that term.  If a license document contains
a further restriction but permits relicensing or conveying under this
License, you may add to a covered work material governed by the terms
of that license document, provided that the further restriction does
not survive such relicensing or conveying.

  If you add terms to a covered work in accord with this section, you
must place, in the relevant source files, a statement of the
additional terms that apply to those files, or a notice indicating
where to find the applicable terms.

  Additional terms, permissive or non-permissive, may be stated in the
form of a separately written license, or stated as exceptions;
the above requirements apply either way.

  8. Termination.

  You may not propagate or modify a covered work except as expressly
provided under this License.  Any attempt otherwise to propagate or
modify it is void, and will automatically terminate your rights under
this License (including any patent licenses granted under the third
paragraph of section 11).

  However, if you cease all violation of this License, then your
license from a particular copyright holder is reinstated (a)
provisionally, unless and until the copyright holder explicitly and
finally terminates your license, and (b) permanently, if the copyright
holder fails to notify you of the violation by some reasonable means
prior to 60 days after the cessation.

  Moreover, your license from a particular copyright holder is
reinstated permanently if the copyright holder notifies you of the
violation by some reasonable means, this is the first time you have
received notice of violation of this License (for any work) from that
copyright holder, and you cure the violation prior to 30 days after
your receipt of the notice.

  Termination of your rights under this section does not terminate the
licenses of parties who have received copies or rights from you under
this License.  If your rights have been terminated and not permanently
reinstated, you do not qualify to receive new licenses for the same
material under section 10.

  9. Acceptance Not Required for Having Copies.

  You are not required to accept this License in order to receive or
run a copy of the Program.  Ancillary propagation of a covered work
occurring solely as a consequence of using peer-to-peer transmission
to receive a copy likewise does not require acceptance.  However,
nothing other than this License grants you permission to propagate or
modify any covered work.  These actions infringe copyright if you do
not accept this License.  Therefore, by modifying or propagating a
covered work, you indicate your acceptance of this License to do so.

  10. Automatic Licensing of Downstream Recipients.

  Each time you convey a covered work, the recipient automatically
receives a license from the original licensors, to run, modify and
propagate that work, subject to this License.  You are not responsible
for enforcing compliance by third parties with this License.

  An "entity transaction" is a transaction transferring control of an
organization, or substantially all assets of one, or subdividing an
organization, or merging organizations.  If propagation of a covered
work results from an entity transaction, each party to that
transaction who receives a copy of the work also receives whatever
licenses to the work the party's predecessor in interest had or could
give under the previous paragraph, plus a right to possession of the
Corresponding Source of the work from the predecessor in interest, if
the predecessor has it or can get it with reasonable efforts.

  You may not impose any further restrictions on the exercise of the
rights granted or affirmed under this License.  For example, you may
not impose a license fee, royalty, or other charge for exercise of
rights granted under this License, and you may not initiate litigation
(including a cross-claim or counterclaim in a lawsuit) alleging that
any patent claim is infringed by making, using, selling, offering for
sale, or importing the Program or any portion of it.

  11. Patents.

  A "contributor" is a copyright holder who authorizes use under this
License of the Program or a work on which the Program is based.  The
work thus licensed is called the contributor's "contributor version".

  A contributor's "essential patent claims" are all patent claims
owned or controlled by the contributor, whether already acquired or
hereafter acquired, that would be infringed by some manner, permitted
by this License, of making, using, or selling its contributor version,
but do not include claims that would be infringed only as a
consequence of further modification of the contributor version.  For
purposes of this definition, "control" includes the right to grant
patent sublicenses in a manner consistent with the requirements of
this License.

  Each contributor grants you a non-exclusive, worldwide, royalty-free
patent license under the contributor's essential patent claims, to
make, use, sell, offer for sale, import and otherwise run, modify and
propagate the contents of its contributor version.

  In the following three paragraphs, a "patent license" is any express
agreement or commitment, however denominated, not to enforce a patent
(such as an express permission to practice a patent or covenant not to
sue for patent infringement).  To "grant" such a patent license to a
party means to make such an agreement or commitment not to enforce a
patent against the party.

  If you convey a covered work, knowingly relying on a patent license,
and the Corresponding Source of the work is not available for anyone
to copy, free of charge and under the terms of this License, through a
publicly available network server or other readily accessible means,
then you must either (1) cause the Corresponding Source to be so
available, or (2) arrange to deprive yourself of the benefit of the
patent license for this particular work, or (3) arrange, in a manner
consistent with the requirements of this License, to extend the patent
license to downstream recipients.  "Knowingly relying" means you have
actual knowledge that, but for the patent license, your conveying the
covered work in a country, or your recipient's use of the covered work
in a country, would infringe one or more identifiable patents in that
country that you have reason to believe are valid.

  If, pursuant to or in connection with a single transaction or
arrangement, you convey, or propagate by procuring conveyance of, a
covered work, and grant a patent license to some of the parties
receiving the covered work authorizing them to use, propagate, modify
or convey a specific copy of the covered work, then the patent license
you grant is automatically extended to all recipients of the covered
work and works based on it.

  A patent license is "discriminatory" if it does not include within
the scope of its coverage, prohibits the exercise of, or is
conditioned on the non-exercise of one or more of the rights that are
specifically granted under this License.  You may not convey a covered
work if you are a party to an arrangement with a third party that is
in the business of distributing software, under which you make payment
to the third party based on the extent of your activity of conveying
the work, and under which the third party grants, to any of the
parties who would receive the covered work from you, a discriminatory
patent license (a) in connection with copies of the covered work
conveyed by you (or copies made from those copies), or (b) primarily
for and in connection with specific products or compilations that
contain the covered work, unless you entered into that arrangement,
or that patent license was granted, prior to 28 March 2007.

  Nothing in this License shall be construed as excluding or limiting
any implied license or other defenses to infringement that may
otherwise be available to you under applicable patent law.

  12. No Surrender of Others' Freedom.

  If conditions are imposed on you (whether by court order, agreement or
otherwise) that contradict the conditions of this License, they do not
excuse you from the conditions of this License.  If you cannot convey a
covered work so as to satisfy simultaneously your obligations under this
License and any other pertinent obligations, then as a consequence you may
not convey it at all.  For example, if you agree to terms that obligate you
to collect a royalty for further conveying from those to whom you convey
the Program, the only way you could satisfy both those terms and this
License would be to refrain entirely from conveying the Program.

  13. Use with the GNU Affero General Public License.

  Notwithstanding any other provision of this License, you have
permission to link or combine any covered work with a work licensed
under version 3 of the GNU Affero General Public License into a single
combined work, and to convey the resulting work.  The terms of this
License will continue to apply to the part which is the covered work,
but the special requirements of the GNU Affero General Public License,
section 13, concerning interaction through a network will apply to the
combination as such.

  14. Revised Versions of this License.

  The Free Software Foundation may publish revised and/or new versions of
the GNU General Public License from time to time.  Such new versions will
be similar in spirit to the present version, but may differ in detail to
address new problems or concerns.

  Each version is given a distinguishing version number.  If the
Program specifies that a certain numbered version of the GNU General
Public License "or any later version" applies to it, you have the
option of following the terms and conditions either of that numbered
version or of any later version published by the Free Software
Foundation.  If the Program does not specify a version number of the
GNU General Public License, you may choose any version ever published
by the Free Software Foundation.

  If the Program specifies that a proxy can decide which future
versions of the GNU General Public License can be used, that proxy's
public statement of acceptance of a version permanently authorizes you
to choose that version for the Program.

  Later license versions may give you additional or different
permissions.  However, no additional obligations are imposed on any
author or copyright holder as a result of your choosing to follow a
later version.

  15. Disclaimer of Warranty.

  THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
APPLICABLE LAW.  EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
PURPOSE.  THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
IS WITH YOU.  SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
ALL NECESSARY SERVICING, REPAIR OR CORRECTION.

  16. Limitation of Liability.

  IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING
WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MODIFIES AND/OR CONVEYS
THE PROGRAM AS PERMITTED ABOVE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY
GENERAL, SPECIAL, INCIDENTAL OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE
USE OR INABILITY TO USE THE PROGRAM (INCLUDING BUT NOT LIMITED TO LOSS OF
DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD
PARTIES OR A FAILURE OF THE PROGRAM TO OPERATE WITH ANY OTHER PROGRAMS),
EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF
SUCH DAMAGES.

  17. Interpretation of Sections 15 and 16.

  If the disclaimer of warranty and limitation of liability provided
above cannot be given local legal effect according to their terms,
reviewing courts shall apply local law that most closely approximates
an absolute waiver of all civil liability in connection with the
Program, unless a warranty or assumption of liability accompanies a
copy of the Program in return for a fee.

                     END OF TERMS AND CONDITIONS

            How to Apply These Terms to Your New Programs

  If you develop a new program, and you want it to be of the greatest
possible use to the public, the best way to achieve this is to make it
free software which everyone can redistribute and change under these terms.

  To do so, attach the following notices to the program.  It is safest
to attach them to the start of each source file to most effectively
state the exclusion of warranty; and each file should have at least
the "copyright" line and a pointer to where the full notice is found.

    <one line to give the program's name and a brief idea of what it does.>
    Copyright (C) <year>  <name of author>

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

Also add information on how to contact you by electronic and paper mail.

  If the program does terminal interaction, make it output a short
notice like this when it starts in an interactive mode:

    <program>  Copyright (C) <year>  <name of author>
    This program comes with ABSOLUTELY NO WARRANTY; for details type `show w'.
    This is free software, and you are welcome to redistribute it
    under certain conditions; type `show c' for details.

The hypothetical commands `show w' and `show c' should show the appropriate
parts of the General Public License.  Of course, your program's commands
might be different; for a GUI interface, you would use an "about box".

  You should also get your employer (if you work as a programmer) or school,
if any, to sign a "copyright disclaimer" for the program, if necessary.
For more information on this, and how to apply and follow the GNU GPL, see
<https://www.gnu.org/licenses/>.

  The GNU General Public License does not permit incorporating your program
into proprietary programs.  If your program is a subroutine library, you
may consider it more useful to permit linking proprietary applications with
the library.  If this is what you want to do, use the GNU Lesser General
Public License instead of this License.  But first, please read
<https://www.gnu.org/licenses/why-not-lgpl.html>.

*/

(function() {
    'use strict';

    let currentTrack = null;
    let lyricsData = null;
    let observer = null;
    let syncInterval = null;
    let modalOpen = false;

    // Funny loading messages - add more here!
    const loadingMessages = [
        "Fetching lyrics, procrastinate till then...",
        "Hunting down those lyrics in the wild...",
        "Bribing the lyrics API with cookies...",
        "Teaching AI to read music notes...",
        "Downloading lyrics at dialup speed...",
        "Asking Spotify nicely for lyrics...",
        "Decoding ancient lyric scrolls...",
        "Convincing the singer to tell us the words...",
        "Translating random humming into actual words...",
        "Trying to remember the song like a goldfish...",
        "Calling that one friend who knows every song ever...",
        "Blaming autocorrect for the missing lyrics...",
        "Collecting chorus fragments like Pokémon...",
        "Convincing the vocals to start mumbling for once...",
        "Running background search through your shower concerts...",
        "Calling for backup from Spotify — again...",
        "Checking the singer’s diary for hints...",
        "Scanning the entire internet — excluding page 2 of Google Search...",
        "Breaking into the vault where artists hide their rhymes...",
        "Rewinding cassette tape to note the lyrics...",
        "Downloading emotional trauma from the chorus...",
        "Sending an owl to Hogwarts for the missing verse...",
        "Interrogating the background vocals for clues...",
        "Contacting aliens from planet Auto-Tune...",
        "Teaching AI to read lips from music video...",
        "Identifying words spoken between heavy breathing...",
        "Trying not to summon copyright lawyers accidentally...",
        "Calling the songwriter — with teleprompter again...",
        "Digging through the comment section for the lyrics...",
        "Contacting Spotify’s CEO for insider info...",
        "Trying to understand whatever the rapper said at 2x speed...",
        "Stalking live performances for clarity...",
        "Pretending to be a music journalist to get intel...",
        "Analyzing 7-second leak from Instagram story...",
        "Cross-examining the chorus like a lawyer...",
        "Negotiating with Spotify to stop shoving 9 ads between every lyric line...",
        "Begging YouTube to let us load lyrics without buying Premium like it's oxygen...",
        "Threatening the music industry with another Grammy slap if lyrics don't load quickly...",
        "Streaming through 47 ads to extract one song...",
        "Checking if the song has been 2.0'ed, Re-Recorded, Remixed, Remastered, or milked again...",
        "Entering lawsuit territory to steal a chorus from Universal Music Group...",
        "Arguing with Spotify about why the band exists outside their algorithm...",
        "Breaking into the Recording Academy because someone here must know the lyrics...",
        "Trying to decipher mumbled vocals of the rapper like we’re CIA cryptographers...",
        "Sending a search party into YouTube comments for that one guy who posts full lyrics...",
        "Mining deep beneath 17 remixes, 12 slowed + reverb versions, and 4 nightcore edits...",
        "Attempting to contact the singer who probably forgot their own lyrics on stage...",
        "Summoning an ex-band member who wrote the song before the breakup lawsuit...",
        "Disabling Spotify’s autoplay before it plays another random AI remix you never asked for...",
        "Interrogating a superfan who hasn't stopped tweeting about the song since 2014...",
        "Raiding TikTok to uncover whether the lyrics are real or just misheard Gen Z propaganda...",
        "Digging through YouTube Shorts where every 5 seconds the song suddenly cuts to Sigma Rizz Music...",
        "Pulling lyrics out from behind 200 layers of autotune like scraping paint with a spoon...",
        "Searching YouTube faster than YouTube can ask 'do you want to try Premium?'",
        "Running background checks on Genius contributors who might be trolling again...",
        "Evading copyright SWAT teams while carrying stolen lyric fragments in a USB drive...",
        "Listening at 0.25x speed to determine whether the word was 'baby' or 'maybe'...",
        "Buying a ticket to the reunion concert nobody asked for just to get one line...",
        "Calling the backup singer who secretly knows the entire song but got no credit...",
        "Decoding mumble rap like a professional linguist on two hours of sleep...",
        "Searching through Spotify playlists named 'Chill Vibes' made by people who hate chill vibes...",
        "Fighting autoplay to stop the next track from starting before we finish this one...",
        "Paying for YouTube Premium and still no lyrics in the description...",
        "Bribing roadies backstage for access to the handwritten album notes...",
        "Sifting through conspiracy theories about what the second verse really meant...",
        "Consulting that one uncle who claims he ‘was in a band once’...",
        "Ping-ponging between 18 live acoustic versions that all sound much different...",
        "Summoning Shazam like a Pokémon but it keeps giving the wrong song...",
        "Sending emotional blackmail emails to Spotify HQ...",
        "Reverse searching the instrumental for lyrics...",
        "Rewinding because the singer said three words in four milliseconds...",
        "Staring at a lyric website pop-up ad that covers... the lyrics...",
        "Downloading the emotion of the song because the words are nowhere to be found...",
        "Breaking glass like Linkin Park just to find the chorus drop...",
        "Reconstructing lyrics from 600 fan edits and one blurry concert video...",
        "Tracking the rapper’s breathing pattern to find where sentences end...",
        "Bringing a polyglot to decipher me the song you selected...",
        "Crawling through 200 karaoke versions uploaded by ‘SongLuvR_2009’...",
        "Sending an SOS to the DJ who keeps yelling his name over the chorus...",
        "Investigating why every Spotify playlist thinks you love heartbreak songs you never asked for...",
        "Digging under three layers of YouTube copyright claim disputes...",
        "Summoning the ghost of a band that broke up after one EP...",
        "Sneaking past YouTube Premium ads with uBlock Origin...",
        "Pretending we know the lyrics confidently like everyone else on Instagram Reels...",
        "Whispering to Spotify that maybe you don't want algorithmic torture today...",
        "Paying royalties to unlock the bridge section like a DLC pack...",
        "Trying to solve the puzzle of whether the lyric was poetic or just poorly pronounced...",
        "Gathering evidence from 14 live shows with 14 different lyrics...",
        "Calling an audio engineer who hasn't slept since the album dropped...",
        "Replaying the chorus 40 times like a lab rat in a musical experiment...",
        "Confronting the singer about diction crimes punishable by lyric jail...",
        "Going undercover inside a fan Discord server—they know EVERYTHING...",
        "Smuggling lyric scraps across international copyright battles...",
        "Psychologically manipulating Spotify's algorithm into showing the right song...",
        "Traveling through 47 sequels of the same Pitbull feature to get one rhyme...",
        "Fixing YouTube's recommendation disaster after one innocent anime soundtrack click...",
        "Waiting for Spotify to stop recommending the same 3 artists you don't care about...",
        "Cross-examining music producers who think clarity is for the weak...",
        "Breaking into Genius annotations like Ocean’s Eleven...",
        "Throttling YouTube for playing a 5-second lyric snippet and 70 minutes of reaction video...",
        "Building the lyrics from waveform shapes...",
        "Running from autoplay before it throws lo-fi study beats at you again...",
        "Finding a bootleg recording uploaded from a 2009 Nokia brick phone...",
        "Scrolling through 900 TikTok edits where the verse is only 7 seconds long...",
        "Wondering why the song has 40 features but no one enunciates...",
        "Translating singer’s emotional screams into human language...",
        "Wondering if Spotify thinks you’re depressed or just vibing incorrectly...",
        "Hacking into a DJ's laptop because he removed the vocals during the drop...",
        "Digging out the lyrics from a 1-hour loop someone uploaded at 480p...",
        "Fighting YouTube's aggressive algorithm which recommends everything except the actual song...",
        "Collecting each lyric shard like Infinity Stones across 5 music platforms...",
        "Trying to trick YouTube into thinking you're not American so lyrics don't auto-dub...",
        "Shouting into the void hoping the singer answers with subtitles...",
        "Consulting astrology to figure out what the vocalist THINKS they said...",
        "Diving into the Spotify rabbit hole where one search ends in 80 new artists somehow...",
        "Trying to solve whether the lyric is English, metaphorical English, or no English...",
        "Calling Elon Musk to launch a satellite dedicated to catching lyrics mid-air...",
        "Asking Reddit at 3 a.m. because someone somewhere has the full lyrics tattooed...",
        "Loading through 5 remix albums that exist exclusively for revenue farming...",
        "Betting on whether YouTube Music or Spotify will disappoint you first today...",
        "Watching live performances where the singer butchers their own verse to pieces...",
        "Measuring vocal vibrations like a scientist because WHY DOES NO ONE SING CLEARLY ANYMORE...",
        "Writing to the Nobel Prize committee for surviving another Spotify ad barrage...",
        "Digging through album leaks like a pirate searching for the holy chorus...",
        "Consulting a vinyl collector who probably paid rent money for this record...",
        "Telling Spotify you don’t need a wellness playlist, you need the ACTUAL WORDS...",
        "Sitting through a 2-minute unskippable YouTube ad to hear 10 seconds of the song...",
        "Streaming the song 40 times so Spotify might acknowledge it exists...",
        "Contacting NASA to see if the lyrics are clearer in space...",
        "Searching for that one guy on YouTube Live Chat who ALWAYS types the lyrics...",
        "Reading the copyright fine print like it's the Da Vinci Code for hidden words...",
        "Trying to identify lyrics before the DJ screams his name on top of them again..."
    ];

    function getRandomLoadingMessage() {
        return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Fetch synced lyrics from LRCLib
    async function fetchLyrics(track, artist, album = '') {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                track_name: track,
                artist_name: artist,
                album_name: album
            });

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://lrclib.net/api/get?${params}`,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error('No lyrics found'));
                    }
                },
                onerror: reject
            });
        });
    }

    // Search for alternative lyrics
    async function searchLyrics(track, artist) {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                track_name: track,
                artist_name: artist
            });

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://lrclib.net/api/search?${params}`,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error('No results found'));
                    }
                },
                onerror: reject
            });
        });
    }

    // Parse LRC format
    function parseLRC(lrc) {
        if (!lrc) return [];
        const lines = lrc.split('\n');
        const parsed = [];

        for (const line of lines) {
            const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const centiseconds = parseInt(match[3]);
                const time = minutes * 60 + seconds + centiseconds / 100;
                const text = match[4].trim();
                if (text) parsed.push({ time, text });
            }
        }
        return parsed;
    }

    // Get current playback time
    function getCurrentTime() {
        const video = document.querySelector('video');
        return video ? video.currentTime : 0;
    }

    // Create synced lyrics display
    function createLyricsDisplay(lyrics) {
        const container = document.querySelector('ytmusic-description-shelf-renderer');
        if (!container) return;

        // Remove YouTube's original lyrics
        const originalLyrics = container.querySelectorAll('yt-formatted-string.description, ytmusic-description-shelf-renderer > yt-formatted-string, .footer.ytmusic-description-shelf-renderer');
        originalLyrics.forEach(el => el.remove());
        const footerElements = container.querySelectorAll('[class*="footer"], [class*="source"]');
        footerElements.forEach(el => el.remove());

        // Remove existing synced lyrics
        const existing = document.getElementById('synced-lyrics-container');
        if (existing) existing.remove();

        const lyricsDiv = document.createElement('div');
        lyricsDiv.id = 'synced-lyrics-container';
        lyricsDiv.style.cssText = `
            margin: 0;
            padding: 20px 0;
            overflow: visible;
        `;

        lyrics.forEach((line) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'lyric-line';
            lineDiv.dataset.time = line.time;
            lineDiv.textContent = line.text;
            lineDiv.style.cssText = `
                padding: 10px 0;
                font-size: 18px;
                line-height: 1.6;
                color: rgba(255,255,255,0.6);
                transition: all 0.3s ease;
                cursor: pointer;
                font-weight: 400;
                word-wrap: break-word;
                overflow-wrap: break-word;
            `;
            lineDiv.onclick = () => {
                const video = document.querySelector('video');
                if (video) video.currentTime = line.time;
            };
            lyricsDiv.appendChild(lineDiv);
        });

        const descriptionContainer = container.querySelector('#description');
        if (descriptionContainer) {
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(lyricsDiv);
        } else {
            container.appendChild(lyricsDiv);
        }

        startSyncLoop(lyrics);
        addSyncButton();
    }

    // Sync lyrics with playback
    function startSyncLoop(lyrics) {
        if (syncInterval) clearInterval(syncInterval);

        syncInterval = setInterval(() => {
            const currentTime = getCurrentTime();
            const lines = document.querySelectorAll('.lyric-line');
            let activeIndex = -1;

            for (let i = 0; i < lyrics.length; i++) {
                if (currentTime >= lyrics[i].time) {
                    activeIndex = i;
                } else {
                    break;
                }
            }

            lines.forEach((line, index) => {
                if (index === activeIndex) {
                    line.style.color = '#fff';
                    line.style.fontSize = '20px';
                    line.style.fontWeight = '500';
                    line.style.transform = 'translateX(0)';

                    // Scroll active line into view
                    line.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    line.style.color = 'rgba(255,255,255,0.6)';
                    line.style.fontSize = '18px';
                    line.style.fontWeight = '400';
                    line.style.transform = 'translateX(0)';
                }
            });
        }, 100);
    }

    // Add buttons to the tab bar
    function addSyncButton() {
        const tabBar = document.querySelector('tp-yt-paper-tabs');
        if (!tabBar) return;

        const existingSync = document.getElementById('sync-lyrics-btn');
        const existingShare = document.getElementById('share-lyrics-btn');
        if (existingSync && existingShare) return;

        tabBar.parentElement.style.position = 'relative';

        // Sync button
        if (!existingSync) {
            const syncBtn = document.createElement('button');
            syncBtn.id = 'sync-lyrics-btn';
            syncBtn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                </svg>
            `;
            syncBtn.title = 'Change synced lyrics';
            syncBtn.style.cssText = `
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.7);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 100;
            `;

            syncBtn.onmouseover = () => {
                syncBtn.style.background = 'rgba(255,255,255,0.1)';
                syncBtn.style.color = '#fff';
            };
            syncBtn.onmouseout = () => {
                syncBtn.style.background = 'transparent';
                syncBtn.style.color = 'rgba(255,255,255,0.7)';
            };

            syncBtn.onclick = () => {
                syncBtn.style.transform = 'translateY(-50%) scale(0.8)';
                setTimeout(() => {
                    syncBtn.style.transform = 'translateY(-50%) scale(1)';
                }, 150);

                const info = getTrackInfo();
                if (info && !modalOpen) {
                    showLyricsSelector(info.track, info.artist);
                }
            };

            tabBar.parentElement.appendChild(syncBtn);
        }

        // Share button
        if (!existingShare) {
            const shareBtn = document.createElement('button');
            shareBtn.id = 'share-lyrics-btn';
            shareBtn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
            `;
            shareBtn.title = 'Share lyrics';
            shareBtn.style.cssText = `
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.7);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 100;
            `;

            shareBtn.onmouseover = () => {
                shareBtn.style.background = 'rgba(255,255,255,0.1)';
                shareBtn.style.color = '#fff';
            };
            shareBtn.onmouseout = () => {
                shareBtn.style.background = 'transparent';
                shareBtn.style.color = 'rgba(255,255,255,0.7)';
            };

            shareBtn.onclick = () => {
                shareBtn.style.transform = 'translateY(-50%) scale(0.8)';
                setTimeout(() => {
                    shareBtn.style.transform = 'translateY(-50%) scale(1)';
                }, 150);

                showLyricsShareModal();
            };

            tabBar.parentElement.appendChild(shareBtn);
        }
    }

    // Show lyrics selector modal
    async function showLyricsSelector(track, artist) {
        if (modalOpen) return;
        modalOpen = true;

        const results = await searchLyrics(track, artist);
        if (!results || results.length === 0) {
            alert('No alternative lyrics found');
            modalOpen = false;
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(18, 18, 18, 0.95);
            padding: 32px;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        const title = document.createElement('h2');
        title.textContent = 'Select Lyrics';
        title.style.cssText = 'margin: 0 0 24px 0; font-size: 24px; font-weight: 500;';
        content.appendChild(title);

        results.forEach((result) => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 16px;
                margin: 12px 0;
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid rgba(255,255,255,0.05);
            `;
            item.onmouseover = () => {
                item.style.background = 'rgba(255,255,255,0.1)';
                item.style.transform = 'translateX(4px)';
            };
            item.onmouseout = () => {
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.transform = 'translateX(0)';
            };
            item.onclick = () => {
                loadSelectedLyrics(result);
                document.body.removeChild(modal);
                modalOpen = false;
            };

            item.innerHTML = `
                <div style="font-weight: 500; font-size: 16px;">${result.trackName}</div>
                <div style="color: rgba(255,255,255,0.7); font-size: 14px;">${result.artistName}</div>
                ${result.albumName ? `<div style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">${result.albumName}</div>` : ''}
                <div style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 8px;">Duration: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}</div>
            `;
            content.appendChild(item);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            margin-top: 24px;
            padding: 12px 24px;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 24px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            width: 100%;
        `;
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
            modalOpen = false;
        };
        content.appendChild(closeBtn);

        modal.appendChild(content);
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                modalOpen = false;
            }
        };
        document.body.appendChild(modal);
    }

    // Load selected lyrics
    function loadSelectedLyrics(result) {
        if (result.syncedLyrics) {
            const parsed = parseLRC(result.syncedLyrics);
            lyricsData = parsed;
            createLyricsDisplay(parsed);
        } else {
            alert('Selected lyrics do not have sync data');
        }
    }

    // Show loading message
    function showLoadingMessage() {
        const container = document.querySelector('ytmusic-description-shelf-renderer');
        if (!container) return;

        const originalLyrics = container.querySelectorAll('yt-formatted-string.description, ytmusic-description-shelf-renderer > yt-formatted-string, .footer.ytmusic-description-shelf-renderer');
        originalLyrics.forEach(el => el.remove());
        const footerElements = container.querySelectorAll('[class*="footer"], [class*="source"]');
        footerElements.forEach(el => el.remove());

        const existing = document.getElementById('synced-lyrics-container');
        if (existing) existing.remove();

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'synced-lyrics-container';
        loadingDiv.style.cssText = `
            margin: 0;
            padding: 60px 20px;
            text-align: center;
            font-size: 16px;
            color: rgba(255,255,255,0.7);
            font-style: italic;
        `;
        loadingDiv.textContent = getRandomLoadingMessage();

        const descriptionContainer = container.querySelector('#description');
        if (descriptionContainer) {
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(loadingDiv);
        } else {
            container.appendChild(loadingDiv);
        }
    }

    // Get track info
    function getTrackInfo() {
        const title = document.querySelector('.title.ytmusic-player-bar');
        const artist = document.querySelector('.byline.ytmusic-player-bar a');
        const thumbnail = document.querySelector('img.ytmusic-player-bar');

        if (title && artist) {
            return {
                track: title.textContent.trim(),
                artist: artist.textContent.trim(),
                thumbnail: thumbnail ? thumbnail.src : null
            };
        }
        return null;
    }

    // Main function to load lyrics
    const loadLyrics = debounce(async () => {
        const info = getTrackInfo();
        if (!info) return;

        const trackKey = `${info.track}-${info.artist}`;
        if (trackKey === currentTrack) return;

        currentTrack = trackKey;
        showLoadingMessage();

        try {
            const data = await fetchLyrics(info.track, info.artist);
            if (data.syncedLyrics) {
                const parsed = parseLRC(data.syncedLyrics);
                lyricsData = parsed;
                createLyricsDisplay(parsed);
            }
        } catch (error) {
            console.log('Could not load synced lyrics:', error);
            const loading = document.getElementById('synced-lyrics-container');
            if (loading) loading.remove();
        }
    }, 1000);

    // Show lyrics share modal
    function showLyricsShareModal() {
        if (modalOpen) return;
        modalOpen = true;

        const info = getTrackInfo();
        if (!info) {
            alert('Could not get track information');
            modalOpen = false;
            return;
        }

        const selectedLines = [];
        let isDarkMode = true;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(20px);
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(18, 18, 18, 0.95);
            padding: 32px;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 500;">Share Lyrics</h2>
            <div id="theme-toggle" style="display: flex; gap: 12px; margin-bottom: 20px; justify-content: center;">
                <button id="dark-btn" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; color: white; cursor: pointer;">Dark Mode</button>
                <button id="light-btn" style="padding: 10px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: rgba(255,255,255,0.6); cursor: pointer;">Light Mode</button>
            </div>
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-bottom: 16px;">Tap lyrics lines to select them:</p>
            <div id="lyrics-selection" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px;"></div>
            <button id="generate-btn" style="width: 100%; padding: 14px; background: transparent; color: white; border: none; border-radius: 24px; cursor: pointer; font-size: 16px; margin-bottom: 12px; transition: transform 0.15s ease;">Generate Image</button>
            <button id="close-share-btn" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; cursor: pointer; transition: transform 0.15s ease;">Close</button>
        `;

        const lyricsSelection = content.querySelector('#lyrics-selection');
        const lines = document.querySelectorAll('.lyric-line');

        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line.textContent;
            lineDiv.style.cssText = `
                padding: 12px;
                margin: 8px 0;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid transparent;
                font-size: 16px;
                line-height: 1.5;
            `;
            lineDiv.onclick = () => {
                const idx = selectedLines.indexOf(index);
                if (idx > -1) {
                    selectedLines.splice(idx, 1);
                    lineDiv.style.background = 'rgba(255,255,255,0.05)';
                    lineDiv.style.borderColor = 'transparent';
                } else {
                    selectedLines.push(index);
                    lineDiv.style.background = 'rgba(255,255,255,0.15)';
                    lineDiv.style.borderColor = 'rgba(255,255,255,0.3)';
                }
            };
            lyricsSelection.appendChild(lineDiv);
        });

        content.querySelector('#dark-btn').onclick = () => {
            isDarkMode = true;
            content.querySelector('#dark-btn').style.background = 'rgba(255,255,255,0.2)';
            content.querySelector('#light-btn').style.background = 'rgba(255,255,255,0.05)';
        };

        content.querySelector('#light-btn').onclick = () => {
            isDarkMode = false;
            content.querySelector('#light-btn').style.background = 'rgba(255,255,255,0.2)';
            content.querySelector('#dark-btn').style.background = 'rgba(255,255,255,0.05)';
        };

        content.querySelector('#generate-btn').onclick = () => {
            if (selectedLines.length === 0) {
                alert('Please select at least one line');
                return;
            }

            // Button animation
            const btn = content.querySelector('#generate-btn');
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);

            setTimeout(() => {
                generateLyricsImage(info, selectedLines, lines, isDarkMode);
                document.body.removeChild(modal);
                modalOpen = false;
            }, 200);
        };

        content.querySelector('#close-share-btn').onclick = () => {
            // Button animation
            const btn = content.querySelector('#close-share-btn');
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
                modalOpen = false;
            }, 150);
        };

        modal.appendChild(content);
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                modalOpen = false;
            }
        };
        document.body.appendChild(modal);
    }

    // Generate Material You colors
    function getMaterialYouColors(isDark) {
        const palettes = [
            { primary: '#6750A4', bg: isDark ? '#1C1B1F' : '#FEF7FF', text: isDark ? '#E8DEF8' : '#1C1B1F' },
            { primary: '#7D5260', bg: isDark ? '#201A1B' : '#FFFBFF', text: isDark ? '#F2B8C5' : '#201A1B' },
            { primary: '#006A6A', bg: isDark ? '#191C1C' : '#F4FFFE', text: isDark ? '#4FD8D8' : '#191C1C' },
        ];
        return palettes[Math.floor(Math.random() * palettes.length)];
    }

    // Generate lyrics image
    function generateLyricsImage(info, selectedIndices, allLines, isDarkMode) {
        const colors = getMaterialYouColors(isDarkMode);

        // Calculate dynamic height based on lyrics count
        const estimatedLyricsHeight = selectedIndices.length * 70; // Rough estimate
        const baseHeight = 1000; // Top section + padding
        const minHeight = 1920;
        const calculatedHeight = Math.max(minHeight, baseHeight + estimatedLyricsHeight + 200);

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = calculatedHeight;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors.primary + '30');
        gradient.addColorStop(1, colors.primary + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const topY = 120;
        const albumSize = 420;
        const albumX = (canvas.width - albumSize) / 2;

        // Draw album art with rounded corners and high resolution
        if (info.thumbnail) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.save();
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.beginPath();
                ctx.roundRect(albumX, topY, albumSize, albumSize, 28);
                ctx.clip();
                ctx.drawImage(img, albumX, topY, albumSize, albumSize);
                ctx.restore();
                continueDrawing();
            };
            img.onerror = () => {
                ctx.fillStyle = colors.primary + '60';
                ctx.beginPath();
                ctx.roundRect(albumX, topY, albumSize, albumSize, 28);
                ctx.fill();
                continueDrawing();
            };
            // Get higher resolution thumbnail
            const highResThumbnail = info.thumbnail.replace(/=w\d+-h\d+/, '=w1000-h1000').replace(/=s\d+/, '=s1000');
            img.src = highResThumbnail;
        } else {
            ctx.fillStyle = colors.primary + '60';
            ctx.beginPath();
            ctx.roundRect(albumX, topY, albumSize, albumSize, 28);
            ctx.fill();
            continueDrawing();
        }

        function continueDrawing() {
            // Song title - Google Sans / Product Sans style
            ctx.fillStyle = colors.text;
            ctx.font = '700 58px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.textAlign = 'center';
            wrapText(ctx, info.track, canvas.width / 2, topY + albumSize + 80, 950, 68);

            // Artist name
            ctx.font = '500 42px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.fillStyle = colors.text + 'CC';
            ctx.fillText(info.artist, canvas.width / 2, topY + albumSize + 155, 950);

            // Lyrics section - BOLD for impact
            const lyricsY = topY + albumSize + 240;
            ctx.textAlign = 'left';
            ctx.font = '700 48px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.fillStyle = colors.text;

            let currentY = lyricsY;
            const maxWidth = 980;
            const lineHeight = 68;

            selectedIndices.sort((a, b) => a - b).forEach(index => {
                const line = allLines[index].textContent;
                const lines = wrapTextToLines(ctx, line, maxWidth);

                lines.forEach(textLine => {
                    ctx.fillText(textLine, 50, currentY);
                    currentY += lineHeight;
                });
            });

            // YouTube Music logo - positioned dynamically
            const logoY = currentY + 120;
            const iconSize = 56;
            const iconX = canvas.width / 2 - 160;

            // Draw play button icon
            ctx.fillStyle = colors.primary;
            ctx.beginPath();
            ctx.arc(iconX, logoY - 12, iconSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Triangle play icon
            ctx.fillStyle = colors.bg;
            ctx.beginPath();
            ctx.moveTo(iconX - 9, logoY - 22);
            ctx.lineTo(iconX - 9, logoY - 2);// ==UserScript==
// @name         YouTube Music Synced Lyrics
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Replace YouTube Music lyrics with synced lyrics from LRCLib
// @author       You
// @match        https://music.youtube.com/*
// @grant        GM_xmlhttpRequest
// @connect      lrclib.net
// ==/UserScript==

(function() {
    'use strict';

    let currentTrack = null;
    let lyricsData = null;
    let observer = null;
    let syncInterval = null;
    let modalOpen = false;

    // Funny loading messages - add more here!
    const loadingMessages = [
        "Fetching lyrics, procrastinate till then...",
        "Hunting down those lyrics in the wild...",
        "Bribing the lyrics API with cookies...",
        "Teaching AI to read music notes...",
        "Downloading lyrics at dialup speed...",
        "Asking Spotify nicely for lyrics...",
        "Decoding ancient lyric scrolls...",
        "Convincing the singer to tell us the words..."
    ];

    function getRandomLoadingMessage() {
        return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    // Fetch synced lyrics from LRCLib
    async function fetchLyrics(track, artist, album = '') {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                track_name: track,
                artist_name: artist,
                album_name: album
            });

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://lrclib.net/api/get?${params}`,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error('No lyrics found'));
                    }
                },
                onerror: reject
            });
        });
    }

    // Search for alternative lyrics
    async function searchLyrics(track, artist) {
        return new Promise((resolve, reject) => {
            const params = new URLSearchParams({
                track_name: track,
                artist_name: artist
            });

            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://lrclib.net/api/search?${params}`,
                onload: (response) => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error('No results found'));
                    }
                },
                onerror: reject
            });
        });
    }

    // Parse LRC format
    function parseLRC(lrc) {
        if (!lrc) return [];
        const lines = lrc.split('\n');
        const parsed = [];

        for (const line of lines) {
            const match = line.match(/\[(\d+):(\d+)\.(\d+)\](.*)/);
            if (match) {
                const minutes = parseInt(match[1]);
                const seconds = parseInt(match[2]);
                const centiseconds = parseInt(match[3]);
                const time = minutes * 60 + seconds + centiseconds / 100;
                const text = match[4].trim();
                if (text) parsed.push({ time, text });
            }
        }
        return parsed;
    }

    // Get current playback time
    function getCurrentTime() {
        const video = document.querySelector('video');
        return video ? video.currentTime : 0;
    }

    // Create synced lyrics display
    function createLyricsDisplay(lyrics) {
        const container = document.querySelector('ytmusic-description-shelf-renderer');
        if (!container) return;

        // Remove YouTube's original lyrics
        const originalLyrics = container.querySelectorAll('yt-formatted-string.description, ytmusic-description-shelf-renderer > yt-formatted-string, .footer.ytmusic-description-shelf-renderer');
        originalLyrics.forEach(el => el.remove());
        const footerElements = container.querySelectorAll('[class*="footer"], [class*="source"]');
        footerElements.forEach(el => el.remove());

        // Remove existing synced lyrics
        const existing = document.getElementById('synced-lyrics-container');
        if (existing) existing.remove();

        const lyricsDiv = document.createElement('div');
        lyricsDiv.id = 'synced-lyrics-container';
        lyricsDiv.style.cssText = `
            margin: 0;
            padding: 20px 0;
            overflow: visible;
        `;

        lyrics.forEach((line) => {
            const lineDiv = document.createElement('div');
            lineDiv.className = 'lyric-line';
            lineDiv.dataset.time = line.time;
            lineDiv.textContent = line.text;
            lineDiv.style.cssText = `
                padding: 10px 0;
                font-size: 18px;
                line-height: 1.6;
                color: rgba(255,255,255,0.6);
                transition: all 0.3s ease;
                cursor: pointer;
                font-weight: 400;
                word-wrap: break-word;
                overflow-wrap: break-word;
            `;
            lineDiv.onclick = () => {
                const video = document.querySelector('video');
                if (video) video.currentTime = line.time;
            };
            lyricsDiv.appendChild(lineDiv);
        });

        const descriptionContainer = container.querySelector('#description');
        if (descriptionContainer) {
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(lyricsDiv);
        } else {
            container.appendChild(lyricsDiv);
        }

        startSyncLoop(lyrics);
        addSyncButton();
    }

    // Sync lyrics with playback
    function startSyncLoop(lyrics) {
        if (syncInterval) clearInterval(syncInterval);

        syncInterval = setInterval(() => {
            const currentTime = getCurrentTime();
            const lines = document.querySelectorAll('.lyric-line');
            let activeIndex = -1;

            for (let i = 0; i < lyrics.length; i++) {
                if (currentTime >= lyrics[i].time) {
                    activeIndex = i;
                } else {
                    break;
                }
            }

            lines.forEach((line, index) => {
                if (index === activeIndex) {
                    line.style.color = '#fff';
                    line.style.fontSize = '20px';
                    line.style.fontWeight = '500';
                    line.style.transform = 'translateX(0)';

                    // Scroll active line into view
                    line.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    line.style.color = 'rgba(255,255,255,0.6)';
                    line.style.fontSize = '18px';
                    line.style.fontWeight = '400';
                    line.style.transform = 'translateX(0)';
                }
            });
        }, 100);
    }

    // Add buttons to the tab bar
    function addSyncButton() {
        const tabBar = document.querySelector('tp-yt-paper-tabs');
        if (!tabBar) return;

        const existingSync = document.getElementById('sync-lyrics-btn');
        const existingShare = document.getElementById('share-lyrics-btn');
        if (existingSync && existingShare) return;

        tabBar.parentElement.style.position = 'relative';

        // Sync button
        if (!existingSync) {
            const syncBtn = document.createElement('button');
            syncBtn.id = 'sync-lyrics-btn';
            syncBtn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                    <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
                </svg>
            `;
            syncBtn.title = 'Change synced lyrics';
            syncBtn.style.cssText = `
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.7);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 100;
            `;

            syncBtn.onmouseover = () => {
                syncBtn.style.background = 'rgba(255,255,255,0.1)';
                syncBtn.style.color = '#fff';
            };
            syncBtn.onmouseout = () => {
                syncBtn.style.background = 'transparent';
                syncBtn.style.color = 'rgba(255,255,255,0.7)';
            };

            syncBtn.onclick = () => {
                syncBtn.style.transform = 'translateY(-50%) scale(0.8)';
                setTimeout(() => {
                    syncBtn.style.transform = 'translateY(-50%) scale(1)';
                }, 150);

                const info = getTrackInfo();
                if (info && !modalOpen) {
                    showLyricsSelector(info.track, info.artist);
                }
            };

            tabBar.parentElement.appendChild(syncBtn);
        }

        // Share button
        if (!existingShare) {
            const shareBtn = document.createElement('button');
            shareBtn.id = 'share-lyrics-btn';
            shareBtn.innerHTML = `
                <svg viewBox="0 0 24 24" style="width: 20px; height: 20px; fill: currentColor;">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
            `;
            shareBtn.title = 'Share lyrics';
            shareBtn.style.cssText = `
                position: absolute;
                right: 20px;
                top: 50%;
                transform: translateY(-50%);
                background: transparent;
                border: none;
                color: rgba(255,255,255,0.7);
                width: 40px;
                height: 40px;
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                z-index: 100;
            `;

            shareBtn.onmouseover = () => {
                shareBtn.style.background = 'rgba(255,255,255,0.1)';
                shareBtn.style.color = '#fff';
            };
            shareBtn.onmouseout = () => {
                shareBtn.style.background = 'transparent';
                shareBtn.style.color = 'rgba(255,255,255,0.7)';
            };

            shareBtn.onclick = () => {
                shareBtn.style.transform = 'translateY(-50%) scale(0.8)';
                setTimeout(() => {
                    shareBtn.style.transform = 'translateY(-50%) scale(1)';
                }, 150);

                showLyricsShareModal();
            };

            tabBar.parentElement.appendChild(shareBtn);
        }
    }

    // Show lyrics selector modal
    async function showLyricsSelector(track, artist) {
        if (modalOpen) return;
        modalOpen = true;

        const results = await searchLyrics(track, artist);
        if (!results || results.length === 0) {
            alert('No alternative lyrics found');
            modalOpen = false;
            return;
        }

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(18, 18, 18, 0.95);
            padding: 32px;
            border-radius: 16px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        const title = document.createElement('h2');
        title.textContent = 'Select Lyrics';
        title.style.cssText = 'margin: 0 0 24px 0; font-size: 24px; font-weight: 500;';
        content.appendChild(title);

        results.forEach((result) => {
            const item = document.createElement('div');
            item.style.cssText = `
                padding: 16px;
                margin: 12px 0;
                background: rgba(255,255,255,0.05);
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.2s;
                border: 1px solid rgba(255,255,255,0.05);
            `;
            item.onmouseover = () => {
                item.style.background = 'rgba(255,255,255,0.1)';
                item.style.transform = 'translateX(4px)';
            };
            item.onmouseout = () => {
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.transform = 'translateX(0)';
            };
            item.onclick = () => {
                loadSelectedLyrics(result);
                document.body.removeChild(modal);
                modalOpen = false;
            };

            item.innerHTML = `
                <div style="font-weight: 500; font-size: 16px;">${result.trackName}</div>
                <div style="color: rgba(255,255,255,0.7); font-size: 14px;">${result.artistName}</div>
                ${result.albumName ? `<div style="color: rgba(255,255,255,0.5); font-size: 13px; margin-top: 4px;">${result.albumName}</div>` : ''}
                <div style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 8px;">Duration: ${Math.floor(result.duration / 60)}:${(result.duration % 60).toString().padStart(2, '0')}</div>
            `;
            content.appendChild(item);
        });

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            margin-top: 24px;
            padding: 12px 24px;
            background: rgba(255,255,255,0.1);
            color: white;
            border: 1px solid rgba(255,255,255,0.2);
            border-radius: 24px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            width: 100%;
        `;
        closeBtn.onclick = () => {
            document.body.removeChild(modal);
            modalOpen = false;
        };
        content.appendChild(closeBtn);

        modal.appendChild(content);
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                modalOpen = false;
            }
        };
        document.body.appendChild(modal);
    }

    // Load selected lyrics
    function loadSelectedLyrics(result) {
        if (result.syncedLyrics) {
            const parsed = parseLRC(result.syncedLyrics);
            lyricsData = parsed;
            createLyricsDisplay(parsed);
        } else {
            alert('Selected lyrics do not have sync data');
        }
    }

    // Show loading message
    function showLoadingMessage() {
        const container = document.querySelector('ytmusic-description-shelf-renderer');
        if (!container) return;

        const originalLyrics = container.querySelectorAll('yt-formatted-string.description, ytmusic-description-shelf-renderer > yt-formatted-string, .footer.ytmusic-description-shelf-renderer');
        originalLyrics.forEach(el => el.remove());
        const footerElements = container.querySelectorAll('[class*="footer"], [class*="source"]');
        footerElements.forEach(el => el.remove());

        const existing = document.getElementById('synced-lyrics-container');
        if (existing) existing.remove();

        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'synced-lyrics-container';
        loadingDiv.style.cssText = `
            margin: 0;
            padding: 60px 20px;
            text-align: center;
            font-size: 16px;
            color: rgba(255,255,255,0.7);
            font-style: italic;
        `;
        loadingDiv.textContent = getRandomLoadingMessage();

        const descriptionContainer = container.querySelector('#description');
        if (descriptionContainer) {
            descriptionContainer.innerHTML = '';
            descriptionContainer.appendChild(loadingDiv);
        } else {
            container.appendChild(loadingDiv);
        }
    }

    // Get track info
    function getTrackInfo() {
        const title = document.querySelector('.title.ytmusic-player-bar');
        const artist = document.querySelector('.byline.ytmusic-player-bar a');
        const thumbnail = document.querySelector('img.ytmusic-player-bar');

        if (title && artist) {
            return {
                track: title.textContent.trim(),
                artist: artist.textContent.trim(),
                thumbnail: thumbnail ? thumbnail.src : null
            };
        }
        return null;
    }

    // Main function to load lyrics
    const loadLyrics = debounce(async () => {
        const info = getTrackInfo();
        if (!info) return;

        const trackKey = `${info.track}-${info.artist}`;
        if (trackKey === currentTrack) return;

        currentTrack = trackKey;
        showLoadingMessage();

        try {
            const data = await fetchLyrics(info.track, info.artist);
            if (data.syncedLyrics) {
                const parsed = parseLRC(data.syncedLyrics);
                lyricsData = parsed;
                createLyricsDisplay(parsed);
            }
        } catch (error) {
            console.log('Could not load synced lyrics:', error);
            const loading = document.getElementById('synced-lyrics-container');
            if (loading) loading.remove();
        }
    }, 1000);

    // Show lyrics share modal
    function showLyricsShareModal() {
        if (modalOpen) return;
        modalOpen = true;

        const info = getTrackInfo();
        if (!info) {
            alert('Could not get track information');
            modalOpen = false;
            return;
        }

        const selectedLines = [];
        let isDarkMode = true;

        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(20px);
            background: rgba(0,0,0,0.7);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.style.cssText = `
            background: rgba(18, 18, 18, 0.95);
            padding: 32px;
            border-radius: 16px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            color: white;
            box-shadow: 0 8px 32px rgba(0,0,0,0.4);
            border: 1px solid rgba(255,255,255,0.1);
        `;

        content.innerHTML = `
            <h2 style="margin: 0 0 20px 0; font-size: 24px; font-weight: 500;">Share Lyrics</h2>
            <div id="theme-toggle" style="display: flex; gap: 12px; margin-bottom: 20px; justify-content: center;">
                <button id="dark-btn" style="padding: 10px 20px; background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); border-radius: 20px; color: white; cursor: pointer;">Dark Mode</button>
                <button id="light-btn" style="padding: 10px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; color: rgba(255,255,255,0.6); cursor: pointer;">Light Mode</button>
            </div>
            <p style="color: rgba(255,255,255,0.7); font-size: 14px; margin-bottom: 16px;">Tap lyrics lines to select them:</p>
            <div id="lyrics-selection" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 12px;"></div>
            <button id="generate-btn" style="width: 100%; padding: 14px; background: transparent; color: white; border: none; border-radius: 24px; cursor: pointer; font-size: 16px; margin-bottom: 12px; transition: transform 0.15s ease;">Generate Image</button>
            <button id="close-share-btn" style="width: 100%; padding: 12px; background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 24px; cursor: pointer; transition: transform 0.15s ease;">Close</button>
        `;

        const lyricsSelection = content.querySelector('#lyrics-selection');
        const lines = document.querySelectorAll('.lyric-line');

        lines.forEach((line, index) => {
            const lineDiv = document.createElement('div');
            lineDiv.textContent = line.textContent;
            lineDiv.style.cssText = `
                padding: 12px;
                margin: 8px 0;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                cursor: pointer;
                border: 2px solid transparent;
                font-size: 16px;
                line-height: 1.5;
            `;
            lineDiv.onclick = () => {
                const idx = selectedLines.indexOf(index);
                if (idx > -1) {
                    selectedLines.splice(idx, 1);
                    lineDiv.style.background = 'rgba(255,255,255,0.05)';
                    lineDiv.style.borderColor = 'transparent';
                } else {
                    selectedLines.push(index);
                    lineDiv.style.background = 'rgba(255,255,255,0.15)';
                    lineDiv.style.borderColor = 'rgba(255,255,255,0.3)';
                }
            };
            lyricsSelection.appendChild(lineDiv);
        });

        content.querySelector('#dark-btn').onclick = () => {
            isDarkMode = true;
            content.querySelector('#dark-btn').style.background = 'rgba(255,255,255,0.2)';
            content.querySelector('#light-btn').style.background = 'rgba(255,255,255,0.05)';
        };

        content.querySelector('#light-btn').onclick = () => {
            isDarkMode = false;
            content.querySelector('#light-btn').style.background = 'rgba(255,255,255,0.2)';
            content.querySelector('#dark-btn').style.background = 'rgba(255,255,255,0.05)';
        };

        content.querySelector('#generate-btn').onclick = () => {
            if (selectedLines.length === 0) {
                alert('Please select at least one line');
                return;
            }

            // Button animation
            const btn = content.querySelector('#generate-btn');
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);

            setTimeout(() => {
                generateLyricsImage(info, selectedLines, lines, isDarkMode);
                document.body.removeChild(modal);
                modalOpen = false;
            }, 200);
        };

        content.querySelector('#close-share-btn').onclick = () => {
            // Button animation
            const btn = content.querySelector('#close-share-btn');
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                document.body.removeChild(modal);
                modalOpen = false;
            }, 150);
        };

        modal.appendChild(content);
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
                modalOpen = false;
            }
        };
        document.body.appendChild(modal);
    }

    // Generate Material You colors
    function getMaterialYouColors(isDark) {
        const palettes = [
            { primary: '#6750A4', bg: isDark ? '#1C1B1F' : '#FEF7FF', text: isDark ? '#E8DEF8' : '#1C1B1F' },
            { primary: '#7D5260', bg: isDark ? '#201A1B' : '#FFFBFF', text: isDark ? '#F2B8C5' : '#201A1B' },
            { primary: '#006A6A', bg: isDark ? '#191C1C' : '#F4FFFE', text: isDark ? '#4FD8D8' : '#191C1C' },
        ];
        return palettes[Math.floor(Math.random() * palettes.length)];
    }

    // Generate lyrics image
    function generateLyricsImage(info, selectedIndices, allLines, isDarkMode) {
        const colors = getMaterialYouColors(isDarkMode);

        // Calculate dynamic height based on lyrics count
        const estimatedLyricsHeight = selectedIndices.length * 70; // Rough estimate
        const baseHeight = 1000; // Top section + padding
        const minHeight = 1920;
        const calculatedHeight = Math.max(minHeight, baseHeight + estimatedLyricsHeight + 200);

        const canvas = document.createElement('canvas');
        canvas.width = 1080;
        canvas.height = calculatedHeight;
        const ctx = canvas.getContext('2d');

        // Background
        ctx.fillStyle = colors.bg;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Gradient overlay
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors.primary + '30');
        gradient.addColorStop(1, colors.primary + '00');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const topY = 120;
        const albumSize = 420;
        const albumX = (canvas.width - albumSize) / 2;

        // Draw album art with rounded corners and high resolution
        if (info.thumbnail) {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                ctx.save();
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';
                ctx.beginPath();
                ctx.roundRect(albumX, topY, albumSize, albumSize, 28);
                ctx.clip();
                ctx.drawImage(img, albumX, topY, albumSize, albumSize);
                ctx.restore();
                continueDrawing();
            };
            img.onerror = () => {
                ctx.fillStyle = colors.primary + '60';
                ctx.beginPath();
                ctx.roundRect(albumX, topY, albumSize, albumSize, 28);
                ctx.fill();
                continueDrawing();
            };
            // Get higher resolution thumbnail
            const highResThumbnail = info.thumbnail.replace(/=w\d+-h\d+/, '=w1000-h1000').replace(/=s\d+/, '=s1000');
            img.src = highResThumbnail;
        } else {
            ctx.fillStyle = colors.primary + '60';
            ctx.beginPath();
            ctx.roundRect(albumX, topY, albumSize, albumSize, 28);
            ctx.fill();
            continueDrawing();
        }

        function continueDrawing() {
            // Song title - Google Sans / Product Sans style
            ctx.fillStyle = colors.text;
            ctx.font = '700 58px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.textAlign = 'center';
            wrapText(ctx, info.track, canvas.width / 2, topY + albumSize + 80, 950, 68);

            // Artist name
            ctx.font = '500 42px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.fillStyle = colors.text + 'CC';
            ctx.fillText(info.artist, canvas.width / 2, topY + albumSize + 155, 950);

            // Lyrics section - BOLD for impact
            const lyricsY = topY + albumSize + 240;
            ctx.textAlign = 'left';
            ctx.font = '700 48px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.fillStyle = colors.text;

            let currentY = lyricsY;
            const maxWidth = 980;
            const lineHeight = 68;

            selectedIndices.sort((a, b) => a - b).forEach(index => {
                const line = allLines[index].textContent;
                const lines = wrapTextToLines(ctx, line, maxWidth);

                lines.forEach(textLine => {
                    ctx.fillText(textLine, 50, currentY);
                    currentY += lineHeight;
                });
            });

            // YouTube Music logo - positioned dynamically
            const logoY = currentY + 120;
            const iconSize = 56;
            const iconX = canvas.width / 2 - 160;

            // Draw play button icon
            ctx.fillStyle = colors.primary;
            ctx.beginPath();
            ctx.arc(iconX, logoY - 12, iconSize / 2, 0, Math.PI * 2);
            ctx.fill();

            // Triangle play icon
            ctx.fillStyle = colors.bg;
            ctx.beginPath();
            ctx.moveTo(iconX - 9, logoY - 22);
            ctx.lineTo(iconX - 9, logoY - 2);
            ctx.lineTo(iconX + 8, logoY - 12);
            ctx.closePath();
            ctx.fill();

            // YouTube Music text
            ctx.fillStyle = colors.primary;
            ctx.font = '600 44px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('YouTube Music', canvas.width / 2 + 35, logoY);

            // Resize canvas to fit content
            const finalHeight = logoY + 100;
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = finalHeight;
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx.drawImage(canvas, 0, 0);

            // Download
            finalCanvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${info.track}-lyrics.png`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    }

    // Helper function to wrap text
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // Helper function to get wrapped lines
    function wrapTextToLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                lines.push(line.trim());
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());
        return lines;
    }

    // Watch for lyrics tab
    function watchForLyricsTab() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            const lyricsTab = document.querySelector('ytmusic-description-shelf-renderer');
            if (lyricsTab && lyricsTab.offsetParent !== null) {
                loadLyrics();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    watchForLyricsTab();

    setInterval(() => {
        const lyricsTab = document.querySelector('ytmusic-description-shelf-renderer');
        if (lyricsTab && lyricsTab.offsetParent !== null) {
            loadLyrics();
        }
    }, 2000);
})();
            ctx.lineTo(iconX + 8, logoY - 12);
            ctx.closePath();
            ctx.fill();

            // YouTube Music text
            ctx.fillStyle = colors.primary;
            ctx.font = '600 44px -apple-system, system-ui, "Google Sans", "Roboto", sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('YouTube Music', canvas.width / 2 + 35, logoY);

            // Resize canvas to fit content
            const finalHeight = logoY + 100;
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = finalHeight;
            const finalCtx = finalCanvas.getContext('2d');
            finalCtx.drawImage(canvas, 0, 0);

            // Download
            finalCanvas.toBlob(blob => {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${info.track}-lyrics.png`;
                a.click();
                URL.revokeObjectURL(url);
            });
        }
    }

    // Helper function to wrap text
    function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
        const words = text.split(' ');
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                ctx.fillText(line, x, y);
                line = words[i] + ' ';
                y += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line, x, y);
    }

    // Helper function to get wrapped lines
    function wrapTextToLines(ctx, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && i > 0) {
                lines.push(line.trim());
                line = words[i] + ' ';
            } else {
                line = testLine;
            }
        }
        lines.push(line.trim());
        return lines;
    }

    // Watch for lyrics tab
    function watchForLyricsTab() {
        if (observer) observer.disconnect();

        observer = new MutationObserver(() => {
            const lyricsTab = document.querySelector('ytmusic-description-shelf-renderer');
            if (lyricsTab && lyricsTab.offsetParent !== null) {
                loadLyrics();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    watchForLyricsTab();

    setInterval(() => {
        const lyricsTab = document.querySelector('ytmusic-description-shelf-renderer');
        if (lyricsTab && lyricsTab.offsetParent !== null) {
            loadLyrics();
        }
    }, 2000);
})();